import { Component, OnInit } from '@angular/core';
import { SpeciesService } from '../../services/species.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
})
export class CatalogoPage implements OnInit {
  birds: any[] = [];

  constructor(private speciesService: SpeciesService, private router: Router) {}

  async ngOnInit() {
    try {
      const response: any = await this.speciesService.getBirdData().toPromise();
      this.birds = response.results.map((bird: any) => ({
        id: bird.id,
        photo: bird.default_photo?.medium_url || 'No disponible',
        commonName: bird.preferred_common_name || 'No disponible',
        scientificName: bird.name || 'No disponible',
      }));
    } catch (error) {
      console.error('Error al obtener datos de aves:', error);
    }
  }

  viewBirdDetails(bird: any) {
    this.router.navigate(['/species-details', bird.id]);
  }
}
