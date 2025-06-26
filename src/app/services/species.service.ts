import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeciesService {
  private readonly apiUrl = 'https://api.inaturalist.org/v1/taxa';

  constructor(private http: HttpClient) {}

  getBirdData(id?: string) {
    if (id) {
      const url = `${this.apiUrl}/${id}`;
      const params = new HttpParams().set('locale', 'es'); // idioma español
      return this.http.get(url, { params });
    }

    // Si no se proporciona `id`, se obtiene la lista de aves chilenas
    const params = new HttpParams()
      .set('place_id', '6793')        // Chile
      .set('taxon_id', '3')           // Aves
      .set('rank', 'species')         // Solo especies
      .set('per_page', '100')         // 100 resultados
      .set('locale', 'es');           // idioma español

    return this.http.get(this.apiUrl, { params });
  }
}
