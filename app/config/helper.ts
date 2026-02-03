import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { ProductMetadata, ProductResult } from './type'

export const formatPrice = (value: unknown) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value.toFixed(0) : ''
    if (typeof value === 'string') {
        const parsed = Number.parseFloat(value)
        return Number.isFinite(parsed) ? parsed.toFixed(0) : ''
    }
    return ''
}

/**
 * Convert metadata to a flat Excel row
 */
const mapMetadataToRow = (item: ProductResult, metadata: ProductMetadata) => ({
    Item_No: metadata.item_num ?? '',
    Cost: formatPrice(metadata.exw_quotes_per_pc),
    Specifications: metadata.specs ?? '',
    Dimensions: metadata.dims ?? '',
    'Request Date': item.metadata.request_date ?? '',
    'Quote Date': metadata.quote_date ?? '',
    'Factory Name': metadata.factory_name ?? '',
    'Sample Status': item.metadata.sample_status ?? '',
    'MOQ Loading Qty': metadata.moq_loading_qty ?? '',
    Program: metadata.program_name ?? '',
    Score: item.score ? (item.score * 100).toFixed(2) : '',
    Volume: item.metadata.u_vol ?? '',
    Source: item.metadata.source ?? '',
})

/**
 * Normalize ProductResult → Excel rows
 */
const normalizeProductForExport = (product: ProductResult) => {
    // CASE 1: No variation → single row
    if (!product.hasVariation) {
        return [mapMetadataToRow(product, product.metadata)]
    }

    // CASE 2: Has variation → map fullData
    if (product.hasVariation && Array.isArray(product.fullData)) {
        return product.fullData.map((variation) =>
            mapMetadataToRow(
                {
                    ...product,
                    score: variation.score ?? product.score
                },
                variation.metadata
            )
        )
    }

    return []
}

/**
 * Export selected products to Excel
 */
export const exportSelectedToExcel = (data: ProductResult[]) => {
    if (!data || data.length === 0) return

    const exportRows = data.flatMap(normalizeProductForExport)

    if (exportRows.length === 0) return

    const worksheet = XLSX.utils.json_to_sheet(exportRows)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Selected Products')

    const buffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
    })

    saveAs(new Blob([buffer]), 'selected-products.xlsx')
}
