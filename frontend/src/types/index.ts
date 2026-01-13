export interface Tipo {
  id: number;
  modelo: string;
}

export interface Marca {
  id: number;
  modelo: string;
}

export interface ModeloAdmin {
  
  id: number;
  nome: string;
  marca: string;
  tipo: string;
  tamanho_polegadas?: number | null;
}

export interface ModeloAdmin {
  id: number;
  modelo: string;
  tipo: string;
  marca: string;
  tipo_id?: number;
  marca_id?: number;
  tamanho_polegadas?: number | null;
}