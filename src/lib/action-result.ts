// src/lib/action-result.ts
//
// Tipe standar untuk return value semua Server Actions.
//
// Kenapa ini penting?
// Server Actions yang `throw` langsung akan menyebabkan error bubble ke client
// tanpa struktur yang jelas. Client harus wrap setiap call dalam try/catch,
// dan pesan error tidak terprediksi.
//
// Dengan ActionResult, setiap action selalu return objek yang bisa langsung
// di-destructure oleh client: if (!result.success) showToast(result.error)

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Bungkus async function dalam try/catch dan return ActionResult.
 * Error apapun (termasuk ZodError) akan ditangkap dan dikembalikan
 * sebagai { success: false, error: string }.
 *
 * @example
 * export async function deleteItem(id: string) {
 *   return withResult(async () => {
 *     await prisma.item.delete({ where: { id } });
 *   });
 * }
 */
export async function withResult<T>(
  fn: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { success: true, data: data as T };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Terjadi kesalahan yang tidak diketahui";

    // Log server-side untuk debugging, jangan expose stack trace ke client
    console.error("[Action Error]", err);

    return { success: false, error: message };
  }
}
