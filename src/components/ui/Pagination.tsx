import { PrimaryButton } from "./buttons/Button";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination flex justify-end items-center gap-3 mt-3">
      <PrimaryButton
        icon={""}
        onClick={handlePrevious}
        text={"Anterior"}
        styles={`px-3 py-1 rounded-[5px] text-[12px] ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={currentPage === 1}
      />
      
      <span className="text-sm">
        Página {currentPage} de {totalPages}
      </span>
      
      <PrimaryButton
        icon={""}
        onClick={handleNext}
        text={"Siguiente"}
        styles={`px-3 py-1 rounded-[5px] text-[12px] ${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={currentPage === totalPages}
      />
    </div>
  );
};