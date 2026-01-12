import { useEffect, useState } from "react";
import { api } from "../api/api";

interface Tipo {
  id: number;
  nome: string;
}

interface Marca {
  id: number;
  nome: string;
}

interface ModeloFormProps {
  onSuccess: () => void;
}

export default function ModeloForm({ onSuccess }: ModeloFormProps) {
  const [nome, setNome] = useState("");
  const [tipoId, setTipoId] = useState<number | undefined>();
  const [marcaId, setMarcaId] = useState<number | undefined>();
  const [tamanho, setTamanho] = useState<number | undefined>();

  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);

  // 🔹 Carrega tipos e marcas ao abrir a tela
  useEffect(() => {
    carregarTipos();
    carregarMarcas();
  }, []);

  async function carregarTipos() {
    const res = await api.get("/tipos");
    setTipos(res.data);
  }

  async function carregarMarcas() {
    const res = await api.get("/admin/marcas");
    setMarcas(res.data);
  }

  function tipoSelecionadoEhMonitor() {
    const tipo = tipos.find((t) => t.id === tipoId);
    return tipo?.nome.toLowerCase() === "monitor";
  }

  async function salvar() {
    if (!nome || !tipoId || !marcaId) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      await api.post("/modelos", {
        nome,
        tipo_id: tipoId,
        marca_id: marcaId,
        tamanho_polegadas: tipoSelecionadoEhMonitor() ? tamanho : null,
      });

      // limpa formulário
      setNome("");
      setTipoId(undefined);
      setMarcaId(undefined);
      setTamanho(undefined);

      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Erro ao salvar modelo");
    }
  }

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Cadastro de Modelo</h2>

      <input
        placeholder="Nome do modelo"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
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
            {tipo.nome}
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
            {marca.nome}
          </option>
        ))}
      </select>

      {tipoSelecionadoEhMonitor() && (
        <input
          type="number"
          placeholder="Tamanho (polegadas)"
          value={tamanho ?? ""}
          onChange={(e) =>
            setTamanho(e.target.value ? Number(e.target.value) : undefined)
          }
        />
      )}

      <button onClick={salvar}>Salvar</button>
    </div>
  );
}
