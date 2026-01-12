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
  modelo: string;
  marca: string;
  tipo: string;
  tamanho_polegadas?: number | null;
}
