from fastapi import FastAPI, Depends, HTTPException
from .database import engine, get_db
from . import models, schemas
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from app.models import Modelo

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de validação de Monitores",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "API rodando com sucesso"}

# -------- TIPOS --------

@app.post("/tipos", response_model=schemas.TipoDispositivoResponse)
def create_tipo(tipo: schemas.TipoDispositivoCreate, db: Session = Depends(get_db)):
    db_tipo = models.TipoDispositivo(modelo=tipo.modelo)
    db.add(db_tipo)
    db.commit()
    db.refresh(db_tipo)
    return db_tipo

@app.get("/tipos", response_model=List[schemas.TipoDispositivoResponse])
def list_tipos(db: Session = Depends(get_db)):
    return db.query(models.TipoDispositivo).all()

# -------- MARCAS --------

@app.post("/marcas", response_model=schemas.MarcaResponse)
def create_marca(marca: schemas.MarcaCreate, db: Session = Depends(get_db)):
    db_marca = models.Marca(modelo=marca.modelo)
    db.add(db_marca)
    db.commit()
    db.refresh(db_marca)
    return db_marca

@app.get("/marcas", response_model=List[schemas.MarcaResponse])
def list_marcas(tipo_id: int | None = None, db: Session = Depends(get_db)):
    query = db.query(models.Marca)

    if tipo_id:
        query = query.join(models.Modelo).filter(models.Modelo.tipo_id == tipo_id)

    return query.distinct().all()

# -------- MODELOS --------

@app.post("/modelos", response_model=schemas.ModeloResponse)
def create_modelo(modelo: schemas.ModeloCreate, db: Session = Depends(get_db)):
    tipo = db.query(models.TipoDispositivo).filter(
        models.TipoDispositivo.id == modelo.tipo_id
    ).first()

    if not tipo:
        raise HTTPException(status_code=404, detail="Tipo não encontrado")

    if tipo.modelo.lower() == "monitor" and modelo.tamanho_polegadas is None:
        raise HTTPException(status_code=400, detail="Monitor exige o campo tamanho")

    if tipo.modelo.lower() == "celular":
        modelo.tamanho_polegadas = None

    db_modelo = models.Modelo(
        modelo=modelo.modelo,
        tipo_id=modelo.tipo_id,
        marca_id=modelo.marca_id,
        tamanho_polegadas=modelo.tamanho_polegadas,
    )

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

# -------- ADMIN --------

@app.get("/admin/modelos", response_model=List[schemas.ModeloAdminResponse])
def list_modelos_admin(
    tipo_id: int | None = None,
    marca_id: int | None = None,
    db: Session = Depends(get_db)
):
    query = (
        db.query(
            models.Modelo.id,
            models.Modelo.modelo.label("modelo"),
            models.Marca.modelo.label("marca"),
            models.TipoDispositivo.modelo.label("tipo"),
            models.Modelo.tamanho_polegadas
        )
        .join(models.Marca, models.Modelo.marca_id == models.Marca.id)
        .join(models.TipoDispositivo, models.Modelo.tipo_id == models.TipoDispositivo.id)
    )

    if tipo_id:
        query = query.filter(models.Modelo.tipo_id == tipo_id)

    if marca_id:
        query = query.filter(models.Modelo.marca_id == marca_id)

    return query.order_by(models.Modelo.modelo).all()

@app.get("/admin/marcas")
def list_marcas_admin(
    tipo_id: int | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Marca)

    if tipo_id:
        query = (
            query
            .join(models.Modelo, models.Modelo.marca_id == models.Marca.id)
            .filter(models.Modelo.tipo_id == tipo_id)
        )

    return [
        {
            "id": marca.id,
            "modelo": marca.modelo 
        }
        for marca in query.distinct().all()
    ]

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

    if tipo.modelo.lower() == "monitor" and modelo.tamanho_polegadas is None:
        raise HTTPException(status_code=400, detail="Monitor exige o campo tamanho")

    if tipo.modelo.lower() == "celular" and modelo.tamanho_polegadas is not None:
        raise HTTPException(status_code=400, detail="Celular não deve possuir tamanho")

    db_modelo.modelo = modelo.modelo
    db_modelo.tipo_id = modelo.tipo_id
    db_modelo.marca_id = modelo.marca_id
    db_modelo.tamanho_polegadas = modelo.tamanho_polegadas

    db.commit()
    db.refresh(db_modelo)
    return db_modelo

@app.delete("/modelos/{id}")
def excluir_modelo(id: int, db: Session = Depends(get_db)):
    modelo = db.query(Modelo).filter(Modelo.id == id).first()

    if not modelo:
        raise HTTPException(status_code=404, detail="Modelo não encontrado")

    db.delete(modelo)
    db.commit()
    return {"message": "Modelo excluído com sucesso"}
