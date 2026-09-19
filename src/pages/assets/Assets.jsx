import React, { useEffect, useState } from "react";

import { useAssets } from "../../hooks/useAssets";

import { PageHeader } from "../../components/layout/PageHeader";
import { AssetFilters } from "../../components/assets/AssetFilters";
import { AssetTable } from "../../components/assets/AssetTable";
import { AssetModal } from "../../components/assets/AssetModal";

import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";

import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

import { getCategories, getTypes } from "../../services/categoryService";

export const Assets = () => {
  // ==========================================
  // ASSET DATA
  // ==========================================

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

    refetch,
    addAsset,
    editAsset,
    removeAsset,
  } = useAssets(10);

  // ==========================================
  // CATEGORY + TYPE DATA
  // ==========================================

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  const [dropdownLoading, setDropdownLoading] = useState(false);

  // ==========================================
  // MODAL
  // ==========================================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  // ==========================================
  // DELETE
  // ==========================================

  const [deleteTargetTag, setDeleteTargetTag] = useState(null);

  // ==========================================
  // GET CATEGORIES + TYPES
  // ==========================================

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        setDropdownLoading(true);

        const [categoryResponse, typeResponse] = await Promise.all([
          getCategories(),
          getTypes(),
        ]);

        console.log("Categories:", categoryResponse);
        console.log("Types:", typeResponse);

        // Categories
        setCategories(Array.isArray(categoryResponse) ? categoryResponse : []);

        // Types
        setTypes(
          typeResponse?.success && Array.isArray(typeResponse.data)
            ? typeResponse.data
            : [],
        );
      } catch (err) {
        console.error("Dropdown API Error:", err);

        setCategories([]);
        setTypes([]);
      } finally {
        setDropdownLoading(false);
      }
    };

    fetchDropdowns();
  }, []);

  // ==========================================
  // OPEN ADD ASSET
  // ==========================================

  const handleOpenAdd = () => {
    setEditingAsset(null);
    setIsModalOpen(true);
  };

  // ==========================================
  // OPEN EDIT ASSET
  // ==========================================

  const handleOpenEdit = (asset) => {
    setEditingAsset(asset);
    setIsModalOpen(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAsset(null);
  };

  // ==========================================
  // SUBMIT ASSET
  // ==========================================

  const handleFormSubmit = async (formData, assetId) => {
    try {
      if (assetId) {
        await editAsset?.(assetId, formData);
      } else {
        await addAsset?.(formData);
      }

      handleCloseModal();
    } catch (err) {
      console.error("Asset Save Error:", err);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-3 -mt-4 text-1xl">
      {/* PAGE HEADER */}

      <PageHeader
        title="Asset Inventory"
        subtitle="Manage hardware catalogs, purchases, and operational status"
        actions={
          <Button size="sm" onClick={handleOpenAdd}>
            <Plus className="h-4 w-4" />
            Add Asset
          </Button>
        }
      />

      {/* FILTERS */}

      <AssetFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        categoryFilter={categoryFilter}
        onCategoryChange={onCategoryChange}
        statusFilter={statusFilter}
        onStatusChange={onStatusChange}
        categories={categories}
      />

      {/* ERROR */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* TABLE */}

      {loading ? (
        <Loader message="Loading hardware repository..." />
      ) : (
        <div className="space-y-3">
          <AssetTable
            assets={assets}
            onEdit={handleOpenEdit}
            onDelete={(tag) => setDeleteTargetTag(tag)}
          />

          {/* PAGINATION */}

          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
              <span className="text-xs text-slate-500">
                Page{" "}
                <span className="font-semibold text-slate-800">{page}</span> of{" "}
                <span className="font-semibold text-slate-800">
                  {totalPages}
                </span>{" "}
                ({totalItems} total)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={prevPage}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={nextPage}
                  disabled={page >= totalPages}
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT ASSET MODAL */}

      <AssetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        assetToEdit={editingAsset}
        types={types}
      />

      {/* DELETE CONFIRMATION */}

      <ConfirmDialog
        isOpen={!!deleteTargetTag}
        onClose={() => setDeleteTargetTag(null)}
        onConfirm={async () => {
          try {
            await removeAsset?.(deleteTargetTag);
            setDeleteTargetTag(null);
          } catch (err) {
            console.error("Delete Asset Error:", err);
          }
        }}
        title="Confirm Asset Deletion"
        message={`Are you certain you wish to delete asset ${deleteTargetTag}? This record will be permanently detached.`}
        confirmLabel="Delete Asset"
        isDestructive
      />
    </div>
  );
};

export default Assets;
