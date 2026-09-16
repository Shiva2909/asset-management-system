import React, { useState } from "react";
import { useAssets } from "../../hooks/useAssets";
import { PageHeader } from "../../components/layout/PageHeader";
import { AssetFilters } from "../../components/assets/AssetFilters";
import { AssetTable } from "../../components/assets/AssetTable";
import { AssetModal } from "../../components/assets/AssetModal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

export const Assets = () => {
  // Hook se data, handlers aur pagination states nikaalein
  const {
    assets,
    loading,
    error,
    searchTerm,
    categoryFilter,
    statusFilter,
    onSearchChange,
    onCategoryChange,
    onStatusChange,
    page,
    totalPages,
    totalItems,
    nextPage,
    prevPage,
    addAsset,
    editAsset,
    removeAsset,
  } = useAssets(10); // 10 items per page

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [deleteTargetTag, setDeleteTargetTag] = useState(null);

  const handleOpenEdit = (asset) => {
    setEditingAsset(asset);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAsset(null);
  };

  const handleFormSubmit = async (data) => {
    if (editingAsset) {
      await editAsset?.(editingAsset.assetTag, data);
    } else {
      await addAsset?.(data);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Inventory"
        subtitle="Manage hardware catalogs, purchases, and operational status"
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Asset
          </Button>
        }
      />

      {/* Backend Filters */}
      <AssetFilters
        searchTerm={searchTerm}
        onSearchChange={(e) => onSearchChange(e.target.value)}
        categoryFilter={categoryFilter}
        onCategoryChange={(val) => onCategoryChange(val)}
        statusFilter={statusFilter}
        onStatusChange={(val) => onStatusChange(val)}
      />

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Table & Loading State */}
      {loading ? (
        <Loader message="Loading hardware repository..." />
      ) : (
        <div className="space-y-4">
          <AssetTable
            assets={assets}
            onEdit={handleOpenEdit}
            onDelete={(tag) => setDeleteTargetTag(tag)}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200">
              <span className="text-sm text-slate-500">
                Page{" "}
                <span className="font-semibold text-slate-800">{page}</span> of{" "}
                <span className="font-semibold text-slate-800">
                  {totalPages}
                </span>{" "}
                ({totalItems} total)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={prevPage}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={nextPage}
                  disabled={page >= totalPages}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <AssetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialValues={editingAsset}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetTag}
        onClose={() => setDeleteTargetTag(null)}
        onConfirm={async () => {
          await removeAsset?.(deleteTargetTag);
          setDeleteTargetTag(null);
        }}
        title="Confirm Asset Deletion"
        message={`Are you certain you wish to delete asset ${deleteTargetTag}? This record will be permanently detached.`}
        confirmLabel="Delete Asset"
        isDestructive
      />
    </div>
  );
};
