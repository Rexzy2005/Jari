1 of 1 error
Next.js (14.2.35) is outdated (learn more)

Unhandled Runtime Error
Error: Choose a farm that belongs to your account.

Source
src\lib\simulated-data.ts (613:22) @ createInventoryItem

  611 |     if (!userId) throw new Error("Sign in as a farmer before adding inventory.");
  612 |     const farm = getFarmerFarms().find((record) => record.id === item.farmId);
> 613 |     if (!farm) throw new Error("Choose a farm that belongs to your account.");
      |                      ^
  614 |     if (!item.name.trim() || !item.category.trim() || !item.unit.trim()) throw new Error("Enter an item name, category and unit.");
  615 |     if (!Number.isFinite(item.initialQuantity) || item.initialQuantity < 0 || !Number.isFinite(item.minimumStock ?? 0) || (item.minimumStock ?? 0) < 0) throw new Error("Stock quantity and low-stock threshold must be zero or more.");
  616 |     if (getInventoryItems().some((record) => record.farmId === item.farmId && record.name.trim().toLowerCase() === item.name.trim().toLowerCase() && (record.lotNumber || "").trim().toLowerCase() === (item.lotNumber || "").trim().toLowerCase() && (record.storageLocation || "").trim().toLowerCase() === (item.storageLocation || "").trim().toLowerCase())) throw new Error("This item, lot and storage location already exist on this farm.");