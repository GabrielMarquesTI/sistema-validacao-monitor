import { useEffect, useState } from "react";
import { api } from "../api/api";

const TIPO_MONITOR_ID = 1;

interface Tipo {
  id: number;
  modelo: string;
}

interface Marca {
  id: number;
  modelo: string;
}

interface ModeloFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  modeloParaEditar?: any | null;
}

export default function ModeloForm({
  onSuccess,
  onCancel,
  modeloParaEditar,
}: ModeloFormProps) {
  const [modelo, setModelo] = useState("");
  const [tipoId, setTipoId] = useState<number | undefined>();
  const [marcaId, setMarcaId] = useState<number | undefined>();
  const [tamanho, setTamanho] = useState<number | undefined>();

  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);

  const editando = Boolean(modeloParaEditar);

  // 🔹 Carrega tipos e marcas
  useEffect(() => {
    carregarTipos();
    carregarMarcas();
  }, []);

  // 🔹 Preenche formulário ao editar
  useEffect(() => {
    if (modeloParaEditar) {
      setModelo(modeloParaEditar.modelo);
      setTipoId(modeloParaEditar.tipo_id);
      setMarcaId(modeloParaEditar.marca_id);
      setTamanho(modeloParaEditar.tamanho_polegadas ?? undefined);
    }
  }, [modeloParaEditar]);

  async function carregarTipos() {
    const res = await api.get("/tipos");
    setTipos(res.data);
  }

  async function carregarMarcas() {
    const res = await api.get("/admin/marcas");
    setMarcas(res.data);
  }

  const ehMonitor = tipoId === TIPO_MONITOR_ID;

  async function salvar() {
    if (!modelo || !tipoId || !marcaId) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    // ✅ tamanho final garantido
    const tamanhoFinal = ehMonitor
      ? Number(
          tamanho !== undefined
            ? tamanho
            : modeloParaEditar?.tamanho_polegadas
        )
      : undefined;

    if (ehMonitor && (!tamanhoFinal || Number.isNaN(tamanhoFinal))) {
      alert("Informe o tamanho do monitor");
      return;
    }

    // ✅ payload correto
    const payload: any = {
      modelo: modelo,
      tipo_id: tipoId,
      marca_id: marcaId,
    };

    if (ehMonitor) {
      payload.tamanho_polegadas = tamanhoFinal;
    }

    console.log("PAYLOAD >>>", payload);

    try {
      if (editando) {
        await api.put(`/modelos/${modeloParaEditar.id}`, payload);
      } else {
        await api.post("/modelos", payload);
      }

      setModelo("");
      setTipoId(undefined);
      setMarcaId(undefined);
      setTamanho(undefined);

      onSuccess();
    } catch (error: any) {
      const data = error.response?.data;

      alert(
        typeof data?.detail === "string"
          ? data.detail
          : "Erro ao salvar modelo"
      );

      console.error("Erro ao salvar:", data || error);
    }
  }

  return (
    <div style={{ marginTop: 30 }}>
      <h2>{editando ? "Editar Modelo" : "Cadastro de Modelo"}</h2>

      <input
        placeholder="Nome do modelo"
        value={modelo}
        onChange={(e) => setModelo(e.target.value)}
      />

      <select
        value={tipoId ?? ""}
        onChange={(e) =>
          setTipoId(e.target.value ? Number(e.target.value) : undefined)
        }
      >
        <option value="">Selecione o tipo</option>
        {tipos.map((tipo) => (
          <option key={tipo.id} value={tipo.id}>
            {tipo.modelo}
          </option>
        ))}
      </select>

      <select
        value={marcaId ?? ""}
        onChange={(e) =>
          setMarcaId(e.target.value ? Number(e.target.value) : undefined)
        }
      >
        <option value="">Selecione a marca</option>
        {marcas.map((marca) => (
          <option key={marca.id} value={marca.id}>
            {marca.modelo}
          </option>
        ))}
      </select>

      {ehMonitor && (
        <input
          type="number"
          placeholder="Tamanho (polegadas)"
          value={tamanho ?? ""}
          onChange={(e) =>
            setTamanho(e.target.value ? Number(e.target.value) : undefined)
          }
        />
      )}

      <div style={{ marginTop: 10 }}>
        <button onClick={salvar}>
          {editando ? "Atualizar" : "Salvar"}
        </button>

        {editando && (
          <button onClick={onCancel} style={{ marginLeft: 10 }}>
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
