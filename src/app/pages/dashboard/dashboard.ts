import { Component, inject }  from '@angular/core';
import { RouterLink }         from "@angular/router";

// Components
import { Algorithms }         from "../../components/algorithms/algorithms";
import { Controls }           from '../../components/controls/controls';
import { Grid }               from '../../components/grid/grid';
import { Statistics }         from '../../components/statistics/statistics';
import { Techniques }         from '../../components/techniques/techniques';

// Environments
import { environment }        from '../../environments/environment';

// Services
import { Theme }              from '../../services/theme';

@Component({
  selector:     'app-dashboard',
  imports: [
    Algorithms,
    Controls,
    Grid,
    RouterLink,
    Statistics,
    Techniques,
],
  templateUrl:  './dashboard.html',
  styleUrl:     './dashboard.scss',
})
export class Dashboard {
  protected themeService =  inject(Theme);
  protected version =       environment.version;
}
