from pydantic import BaseModel
from typing import List, Optional


# -------- TIPOS DE DISPOSITIVO --------

class TipoDispositivoBase(BaseModel):
    modelo: str


class TipoDispositivoCreate(TipoDispositivoBase):
    pass


class TipoDispositivoResponse(TipoDispositivoBase):
    id: int

    class Config:
        from_attributes = True


# -------- MARCAS --------

class MarcaBase(BaseModel):
    modelo: str


class MarcaCreate(MarcaBase):
    pass


class MarcaResponse(MarcaBase):
    id: int

    class Config:
        from_attributes = True


# -------- MODELOS --------

class ModeloBase(BaseModel):
    modelo: str
    tamanho_polegadas: Optional[float] = None
    tipo_id: int
    marca_id: int


class ModeloCreate(BaseModel):
    modelo: str
    tipo_id: int
    marca_id: int
    tamanho_polegadas: float | None = None


class ModeloResponse(ModeloBase):
    id: int

    class Config:
        from_attributes = True


# ----- ADMIN VIEW -------

class ModeloAdminResponse(BaseModel):
    id: int
    modelo: str
    marca: str
    tipo: str
    tamanho_polegadas: float | None

    class Config:
        from_attributes = True

# ATUALIZAR DADOS

class ModeloUpdate(BaseModel):
    modelo: str
    tipo_id: int
    marca_id: int
    tamanho_polegadas: float | None = None
