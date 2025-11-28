import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Edit2, Trash2, ImageIcon, GripVertical } from "lucide-react";
import { type Product } from "@/features/admin/services/productService";
import { useState, useEffect } from "react";

// --- KOMPONEN BARIS (ROW) YANG BISA DI-DRAG ---
function SortableRow({
  product,
  onEdit,
  onDelete,
  onImageClick,
  formatPrice,
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  onImageClick: (url: string) => void;
  formatPrice: (p: number) => string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as "relative",
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-t transition-colors ${
        isDragging ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      <td className="p-4 w-10">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          type="button"
        >
          <GripVertical size={20} />
        </button>
      </td>

      <td className="p-4">
        <div className="flex items-center gap-3">
          {product.image?.startsWith("http") ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-14 h-14 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200 shadow-sm border"
              onClick={() => onImageClick(product.image)}
              loading="lazy"
            />
          ) : (
            <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-lg text-2xl">
              {product.image || "🍽️"}
            </div>
          )}
          <span className="font-medium text-gray-800">{product.name}</span>
        </div>
      </td>
      <td className="p-4 text-center text-gray-600 max-w-xs truncate">
        {product.description || "-"}
      </td>
      <td className="p-4 font-semibold text-center text-gray-800">
        {formatPrice(product.price)}
      </td>
      <td className="p-4 text-center">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {product.category}
        </span>
      </td>
      <td className="p-4">
        <div className="flex gap-2 justify-center">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(product)}
            className="hover:bg-blue-50 hover:border-blue-300"
          >
            <Edit2 size={16} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );
}

// --- KOMPONEN UTAMA ---
interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onImageClick: (url: string) => void;
  onReorder?: (newOrder: Product[]) => void;
}

export function ProductTable({
  products,
  loading,
  onEdit,
  onDelete,
  onImageClick,
  onReorder,
}: ProductTableProps) {
  const [items, setItems] = useState<Product[]>(products);

  useEffect(() => {
    setItems(products);
  }, [products]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newOrder = arrayMove(items, oldIndex, newIndex);

      setItems(newOrder);

      if (onReorder) {
        onReorder(newOrder);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (products.length === 0 && !loading) {
    return (
      <Card className="bg-white border shadow-sm mt-6">
        <CardContent className="p-0">
          <div className="text-center py-16 text-gray-500">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Produk tidak ditemukan</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border shadow-sm mt-6">
      <CardContent className="p-0">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="bg-white">
                  <th className="w-10 p-4"></th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Produk
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-700">
                    Keterangan
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-700">
                    Harga
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-700">
                    Kategori
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>

              <SortableContext
                items={items.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <tbody>
                  {items.map((product) => (
                    <SortableRow
                      key={product.id}
                      product={product}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onImageClick={onImageClick}
                      formatPrice={formatPrice}
                    />
                  ))}
                </tbody>
              </SortableContext>
            </table>
          </div>
        </DndContext>
      </CardContent>
    </Card>
  );
}
