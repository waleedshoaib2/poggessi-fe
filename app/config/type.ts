export interface ProductMetadata {
    description: string
    dims: string
    exw_quotes_per_pc: string
    factory_name: string
    img_ref: string
    item_num: string
    material_finishing: string
    modality: 'text' | 'image'
    moq_loading_qty: number
    program_name: string
    quote_date: string // ISO date string
    request_date: string // ISO date string
    sample_status: string
    specs: string
    tags: string[]
    u_vol: number
    source: string
    signed_urls: string[]
}

export interface ProductVariation {
    id: string
    dims: string
    exw_quotes_per_pc: string
    item_num: string
    tags: string[]
    u_vol: number
}
export interface FullProductData {
    id: string
    score: number
    metadata: ProductMetadata
}

export interface ProductResult {
    id: string
    score: number
    metadata: ProductMetadata
    hasVariation?: boolean
    variations?: ProductVariation[]
    fullData?: FullProductData[]
    variationCount?: number
}
