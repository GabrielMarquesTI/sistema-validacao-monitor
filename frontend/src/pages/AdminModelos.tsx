import { useEffect, useState } from "react";
import { api } from "../api/api";
import { type ModeloAdmin } from "../types";
import ModeloTable from "../components/ModeloTable";
import Filtros from "../components/Filtros";
import ModeloForm from "../components/ModeloForm";

export default function AdminModelos() {
  const [modelos, setModelos] = useState<ModeloAdmin[]>([]);
  const [modeloEditando, setModeloEditando] = useState<ModeloAdmin | null>(null);
  const [refresh, setRefresh] = useState(false);

  async function carregarModelos(params?: any) {
    const res = await api.get("/admin/modelos", { params });
    setModelos(res.data);
  }

  useEffect(() => {
    carregarModelos();
  }, [refresh]);

  function editarModelo(modelo: ModeloAdmin) {
    setModeloEditando(modelo);
  }

  function fecharForm() {
    setModeloEditando(null);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin - Modelos</h1>

      <Filtros onFiltrar={carregarModelos} />

      <ModeloTable
        modelos={modelos}
        onEdit={editarModelo}
      />

      <ModeloForm
        modeloParaEditar={modeloEditando}
        onCancel={fecharForm}
        onSuccess={() => {
          fecharForm();
          setRefresh(!refresh);
        }}
      />
    </div>
  );
}
