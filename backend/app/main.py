from fastapi import FastAPI, Depends, HTTPException
from .database import engine, get_db
from . import models, schemas
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de validação de Monitores",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def read_root():
    return {"status": "API rodando com sucesso"}

@app.post("/tipos", response_model=schemas.TipoDispositivoResponse)
def create_tipo(
    tipo: schemas.TipoDispositivoCreate,
    db: Session = Depends(get_db)
):
    db_tipo = models.TipoDispositivo(nome=tipo.nome)
    db.add(db_tipo)
    db.commit()
    db.refresh(db_tipo)
    return db_tipo


@app.get("/tipos", response_model=List[schemas.TipoDispositivoResponse])
def list_tipos(db: Session = Depends(get_db)):
    return db.query(models.TipoDispositivo).all()

@app.post("/marcas", response_model=schemas.MarcaResponse)
def create_marca(
    marca: schemas.MarcaCreate,
    db: Session = Depends(get_db)
):
    db_marca = models.Marca(nome=marca.nome)
    db.add(db_marca)
    db.commit()
    db.refresh(db_marca)
    return db_marca


@app.get("/marcas", response_model=List[schemas.MarcaResponse])
def list_marcas(
    tipo_id: int | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Marca)

    if tipo_id:
        query = query.join(models.Modelo).filter(models.Modelo.tipo_id == tipo_id)

    return query.distinct().all()

@app.post("/modelos", response_model=schemas.ModeloResponse)
def create_modelo(
    modelo: schemas.ModeloCreate,
    db: Session = Depends(get_db)
):
    tipo = db.query(models.TipoDispositivo).filter(
        models.TipoDispositivo.id == modelo.tipo_id
    ).first()

    if not tipo:
        raise HTTPException(status_code=404, detail="Tipo não encontrado")

    if tipo.nome.lower() == "monitor" and modelo.tamanho_polegadas is None:
        raise HTTPException(
            status_code=400,
            detail="Monitor exige o campo tamanho"
        )

    if tipo.nome.lower() == "celular":
        modelo.tamanho_polegadas = None

    db_modelo = models.Modelo(**modelo.dict())
    db.add(db_modelo)
    db.commit()
    db.refresh(db_modelo)

    return db_modelo




@app.get("/modelos", response_model=List[schemas.ModeloResponse])
def list_modelos(
    tipo_id: int | None = None,
    marca_id: int | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Modelo)

    if tipo_id:
        query = query.filter(models.Modelo.tipo_id == tipo_id)

    if marca_id:
        query = query.filter(models.Modelo.marca_id == marca_id)

    return query.all()

@app.get("/admin/modelos", response_model=List[schemas.ModeloAdminResponse])
def list_modelos_admin(
    tipo_id: int | None = None, 
    marca_id: int | None = None,
    db: Session = Depends(get_db)
):
    query = (
        db.query(
            models.Modelo.id,
            models.Modelo.nome.label("modelo"),
            models.Marca.nome.label("marca"),
            models.TipoDispositivo.nome.label("tipo"),
            models.Modelo.tamanho_polegadas
        )
        .join(models.Marca, models.Modelo.marca_id == models.Marca.id)
        .join(models.TipoDispositivo, models.Modelo.tipo_id == models.TipoDispositivo.id)
)
    if tipo_id:
        query = query.filter(models.Modelo.tipo_id == tipo_id)

    if marca_id:
        query = query.filter(models.Modelo.marca_id == marca_id)

    return query.order_by(models.Modelo.nome).all()

@app.get("/admin/marcas")
def list_marcas_admin(
    tipo_id: int | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Marca)

    if tipo_id:
        query = query.outerjoin(models.Modelo).filter(
            (models.Modelo.tipo_id == tipo_id) | (models.Modelo.id == None)
        )

    return query.distinct().all()

@app.put("/modelos/{modelo_id}", response_model=schemas.ModeloResponse)
def update_modelo(
    modelo_id: int,
    modelo: schemas.ModeloUpdate,
    db: Session = Depends(get_db)
):
    db_modelo = db.query(models.Modelo).filter(
        models.Modelo.id == modelo_id
    ).first()

    if not db_modelo:
        raise HTTPException(status_code=404, detail="Modelo não encontrado")

    tipo = db.query(models.TipoDispositivo).filter(
        models.TipoDispositivo.id == modelo.tipo_id
    ).first()

    if not tipo:
        raise HTTPException(status_code=404, detail="Tipo não encontrado")

    # 🔒 Validação condicional
    if tipo.nome.lower() == "monitor":
        if modelo.tamanho_polegadas is None:
            raise HTTPException(
                status_code=400,
                detail="Monitor exige o campo tamanho"
            )

    if tipo.nome.lower() == "celular":
        if modelo.tamanho_polegadas is not None:
            raise HTTPException(
                status_code=400,
                detail="Celular não deve possuir tamanho"
            )

    # 🔄 Atualização
    db_modelo.nome = modelo.modelo
    db_modelo.tipo_id = modelo.tipo_id
    db_modelo.marca_id = modelo.marca_id
    db_modelo.tamanho_polegadas = modelo.tamanho_polegadas

    db.commit()
    db.refresh(db_modelo)

    return db_modelo