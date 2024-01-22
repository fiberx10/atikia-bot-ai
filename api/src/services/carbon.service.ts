import axios, { AxiosInstance } from 'axios'

interface ICarbonFile {
  id: string
  name: string
  created_at: string
  source: string
  file_statistics: {
    file_format: string
    file_size: number
    num_characters: number
    num_tokens: number
    num_embeddings: number
  }
}

/**
 * @class CarbonService
 * @classdesc
 * This is a service that handles all the requests to the Carbon API.
 * @example
 * const carbonService = new CarbonService();
 * const files = await carbonService.getFiles();
 * const fileIds = files.results.map((f) => f.id);
 * await carbonService.deleteFiles(fileIds);
 **/

class CarbonService {
  private _CarbonClient: AxiosInstance
  constructor() {
    this._CarbonClient = axios.create({
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.CARBON_API_KEY,
        'customer-id': process.env.CARBON_CUSTOMER_ID,
      },
      timeout: 100000,
      baseURL: process.env.CARBON_URL,
    })
  }

  public async getEmbedding(query: string) {
    const body = {
      query: query,
      k: 10,
    }

    const response = await this._CarbonClient.post('embeddings', body)
    return response.data
  }

  public async getFiles() {
    const response = await this._CarbonClient.post('user_files_v2', {
      pagination: {
        limit: 10,
        offset: 0,
      },
    })
    return response.data as { results: ICarbonFile[] }
  }

  public async deleteFiles(fileIds: string[]) {
    const response = await this._CarbonClient.post('delete_files', {
      file_ids: [...fileIds.map(f => parseInt(f))],
    })
    return response.data as { success: string | boolean }
  }

  public async uploadFile(file: FormData) {
    const params = {
      chunk_size: 400,
      chunk_overlap: 50,
      skip_embedding_generation: false,
    }
    const response = await this._CarbonClient.post('uploadfile', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: params,
    })
    return response.data
  }
}

export default CarbonService
