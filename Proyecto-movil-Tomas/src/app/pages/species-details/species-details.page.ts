import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpeciesService } from '../../services/species.service';

@Component({
  selector: 'app-species-details',
  templateUrl: './species-details.page.html',
  styleUrls: ['./species-details.page.scss'],
})
export class SpeciesDetailsPage implements OnInit {
  bird: any;

  constructor(
    private route: ActivatedRoute,
    private speciesService: SpeciesService
  ) {}

  async ngOnInit() {
    const birdId = this.route.snapshot.paramMap.get('id');
    if (birdId) {
      try {
        const response: any = await this.speciesService.getBirdData(birdId).toPromise();
        const bird = response.results[0];
        this.bird = {
          photo: bird.default_photo?.medium_url || 'No disponible',
          commonName: bird.preferred_common_name || 'No disponible',
          scientificName: bird.name || 'No disponible',
          description: this.getFullDescription(bird) || 'Descripción no disponible',
          location: bird.place_guess || 'Lugar no disponible',
        };
      } catch (error) {
        console.error('Error al obtener los detalles del ave:', error);
      }
    }
  }

  // Función para seleccionar el texto más completo disponible
  getFullDescription(bird: any): string {
    const description = bird.wikipedia_text || bird.wikipedia_summary;
    return this.stripHtml(description);
  }

  // Función para eliminar etiquetas HTML
  stripHtml(html: string): string {
    return html ? html.replace(/<[^>]+>/g, '') : '';
  }
}
