from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from .database import Base


class TipoDispositivo(Base):
    __tablename__ = "tipos_dispositivo"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, unique=True, nullable=False)

    modelos = relationship("Modelo", back_populates="tipo")


class Marca(Base):
    __tablename__ = "marcas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, unique=True, nullable=False)

    modelos = relationship("Modelo", back_populates="marca")


class Modelo(Base):
    __tablename__ = "modelos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    tamanho_polegadas = Column(Float, nullable=True)

    tipo_id = Column(Integer, ForeignKey("tipos_dispositivo.id"), nullable=False)
    marca_id = Column(Integer, ForeignKey("marcas.id"), nullable=False)

    tipo = relationship("TipoDispositivo", back_populates="modelos")
    marca = relationship("Marca", back_populates="modelos")
