import React, { useRef } from "react";
import { PrimaryButton } from "./buttons/Button";
import { XIcon } from "lucide-react";

export type FieldType = "text" | "email" | "number" | "select" | "password" | "time";

export interface Field {
  label: string;
  name: string;
  type: FieldType;
  placeholder?: string;
  options?: {
    label: string;
    value: string;
  }[];
  required?: boolean
}

export type FieldOption = {
  label: string;
  value: string;
};

export type DynamicFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  fields: Field[];
  onSubmit: (formData: FormData) => void;
  buttonText: string;
  initialValues?: Record<string, string>;
};

const DynamicFormModal: React.FC<DynamicFormModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  fields,
  onSubmit,
  buttonText,
  initialValues
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000ab] bg-opacity-70 animate-fadeIn">
      <div className="bg-black border-[1px] border-gray-800 p-6 rounded-lg max-w-[90%] max-h-[90%] overflow-auto animate-scaleIn">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">{title}</h3>
            <XIcon size={20} onClick={onClose} className="bg-transparent rounded-[5px] cursor-pointer transition-all ml-5 hover:scale-110" />
          </div>
          <p className="text-gray-400 text-[13px]">{description}</p>
        </div>
        <form ref={formRef} className="flex flex-col w-full gap-1 mt-5" onSubmit={handleSubmit}>
          {fields.map((field, index) => {
            const { label, name, type, placeholder, options } = field;

            return (
              <label key={index} className="flex flex-col font-normal text-sm">
                {label}
                {type === "select" ? (
                  <select name={name} className="border p-2 rounded border-gray-500 bg-black" defaultValue={initialValues?.[name] || ""} required={field.required}>
                    <option value="">Seleccione una opción</option>
                    {options?.map((opt, i) => (
                      <option key={i} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    autoComplete="off"
                    className="border-[1px] border-gray-500"
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    defaultValue={initialValues?.[name] || ""}
                    required={field.required}
                  />

                )}
              </label>
            );
          })}
          <PrimaryButton
            disabled={false}
            text={buttonText}
            styles={"mt-3 h-10 rounded-[5px] bg-white text-black"}
            onClick={() => { }}
            icon={""}
          />
        </form>
      </div>
    </div>
  );
};

export default DynamicFormModal;