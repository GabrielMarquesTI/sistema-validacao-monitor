import {type ModeloAdmin } from "../types";

interface ModeloTableProps {
  modelos: ModeloAdmin[];
  onEdit: (modelo: ModeloAdmin) => void;
  onDelete: (modelo: ModeloAdmin) => void,
}

export default function ModeloTable({ modelos, onEdit, onDelete }: ModeloTableProps) {
    return (
    <div style={{ marginTop: 20 }}>
      <h2>Tabela de Modelos</h2>

      <table width="100%" border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Modelo</th>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Tamanho</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {modelos.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                Nenhum modelo encontrado
              </td>
            </tr>
          ) : (
            modelos.map((modelo) => (
              <tr key={modelo.id}>
                <td>{modelo.id}</td>
                <td>{modelo.modelo}</td>
                <td>{modelo.tipo}</td>
                <td>{modelo.marca}</td>
                <td>{modelo.tamanho_polegadas ?? "-"}</td>
                <td>
                  <button onClick={() => onEdit(modelo)}>
                    Editar
                  </button>
                  <button onClick={() => onDelete(modelo)}>
                    Excluir
                    </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
