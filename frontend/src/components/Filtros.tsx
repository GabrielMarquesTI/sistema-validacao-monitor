import { useEffect, useState } from "react";
import { api } from "../api/api";

interface Tipo {
  id: number;
  modelo: string;
}

interface Marca {
  id: number;
  modelo: string;
}

interface FiltrosProps {
  onFiltrar: (params: {
    tipo_id?: number;
    marca_id?: number;
  }) => void;
}

export default function Filtros({ onFiltrar }: FiltrosProps) {
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [tipoId, setTipoId] = useState<number | undefined>();
  const [marcaId, setMarcaId] = useState<number | undefined>();

  useEffect(() => {
    carregarTipos();
    carregarMarcas();
  }, []);

  async function carregarTipos() {
    const response = await api.get("/tipos");
    setTipos(response.data);
  }

  async function carregarMarcas() {
    const response = await api.get("/admin/marcas");
    setMarcas(response.data);
  }

  function aplicarFiltro() {
    onFiltrar({
      tipo_id: tipoId,
      marca_id: marcaId,
    });
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Filtros</h3>

      <select
        value={tipoId ?? ""}
        onChange={(e) =>
          setTipoId(e.target.value ? Number(e.target.value) : undefined)
        }
      >
        <option value="">Todos os tipos</option>
        {tipos.map((tipo) => (
          <option key={tipo.id} value={tipo.id}>
            {String(tipo.modelo)}
          </option>
        ))}
      </select>

      <select
        value={marcaId ?? ""}
        onChange={(e) =>
          setMarcaId(e.target.value ? Number(e.target.value) : undefined)
        }
        style={{ marginLeft: 10 }}
      >
        <option value="">Todas as marcas</option>
        {marcas.map((marca) => (
          <option key={marca.id} value={marca.id}>
            {String(marca.modelo)}
          </option>
        ))}
      </select>

      <button onClick={aplicarFiltro} style={{ marginLeft: 10 }}>
        Filtrar
      </button>
    </div>
  );
}
