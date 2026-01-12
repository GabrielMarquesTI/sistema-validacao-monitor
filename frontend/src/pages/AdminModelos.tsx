import { useEffect, useState } from "react";
import { api } from "../api/api";
import { type ModeloAdmin } from "../types";
import Filtros from "../components/Filtros";
import ModeloTable from "../components/ModeloTable";
import ModeloForm from "../components/ModeloForm";

interface FiltroParams {
  tipo_id?: number;
  marca_id?: number;
}

export default function AdminModelos() {
  const [modelos, setModelos] = useState<ModeloAdmin[]>([]);
  const [refresh, setRefresh] = useState(false);

  const carregarModelos = async (params?: FiltroParams) => {
    const res = await api.get("/admin/modelos", { params });
    setModelos(res.data);
  };

  useEffect(() => {
    carregarModelos();
  }, [refresh]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin - Modelos</h1>

      <Filtros onFiltrar={carregarModelos} />

      <ModeloTable modelos={modelos} />

      <ModeloForm onSuccess={() => setRefresh(!refresh)} />
    </div>
  );
}
