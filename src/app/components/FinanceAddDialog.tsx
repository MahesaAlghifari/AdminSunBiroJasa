import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";

interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  placeholder?: string;
  options?: string[];
}

interface FinanceAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  fields: FieldConfig[];
  onSubmit: (data: any[]) => void;
}

export function FinanceAddDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  onSubmit
}: FinanceAddDialogProps) {
  const getEmptyRow = () => {
    const row: any = {};
    fields.forEach(field => {
      row[field.key] = "";
    });
    return row;
  };

  const [rows, setRows] = useState([getEmptyRow()]);

  const handleAddRow = () => {
    setRows([...rows, getEmptyRow()]);
  };

  const handleRemoveRow = (index: number) => {
    if (rows.length === 1) {
      toast.error("Minimal harus ada 1 data!");
      return;
    }
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleFieldChange = (rowIndex: number, fieldKey: string, value: any) => {
    const newRows = [...rows];
    newRows[rowIndex][fieldKey] = value;
    setRows(newRows);
  };

  const handleSubmit = () => {
    // Validate all rows
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      for (const field of fields) {
        if (!row[field.key] || row[field.key] === "") {
          toast.error(`Data ke-${i + 1}: ${field.label} harus diisi!`);
          return;
        }
      }
    }

    onSubmit(rows);
    setRows([getEmptyRow()]);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setRows([getEmptyRow()]);
    onOpenChange(false);
  };

  const renderField = (row: any, rowIndex: number, field: FieldConfig) => {
    if (field.type === "select" && field.options) {
      return (
        <Select
          value={row[field.key]}
          onValueChange={(value) => handleFieldChange(rowIndex, field.key, value)}
        >
          <SelectTrigger className="bg-input-background border-border">
            <SelectValue placeholder={field.placeholder || `Pilih ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        type={field.type}
        placeholder={field.placeholder || field.label}
        className="bg-input-background border-border"
        value={row[field.key]}
        onChange={(e) => handleFieldChange(rowIndex, field.key, e.target.value)}
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="p-4 rounded-lg border border-border bg-secondary/20 space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm">Data #{rowIndex + 1}</h4>
                  {rows.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRow(rowIndex)}
                      className="h-8 w-8 p-0 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label className="text-xs">{field.label}</Label>
                      {renderField(row, rowIndex, field)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-center py-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleAddRow}
            className="border-dashed border-2 w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Data Lagi
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Batal
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleSubmit}>
            Simpan Semua ({rows.length} data)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
