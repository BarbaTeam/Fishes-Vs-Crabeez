import { Component, Input } from '@angular/core';
import { Grade, Grading } from 'src/app/shared/models/results.model';

@Component({
  selector: 'app-grading-line',
  templateUrl: './grading-line.component.html',
  styleUrls: ['./grading-line.component.scss']
})
export class GradingLineComponent {
  /** Libellé de la notion ou question */
  @Input() key!: string;

  /** Objet de notation */
  @Input() grading!: Grading;

  /** Amélioration facultative (en pourcentage, positif ou négatif) */
  @Input() improvement?: number;

  /**
   * Retourne la couleur associée à la note.
   */
  public gradeColor(): string {
    switch (this.grading.grade) {
      case Grade.A_PLUS:  return 'gold';
      case Grade.A:       return 'green';
      case Grade.A_MINUS: return 'green';
      case Grade.B_PLUS:  return 'lightblue';
      case Grade.B:       return 'lightblue';
      case Grade.B_MINUS: return 'lightblue';
      case Grade.C_PLUS:  return 'blue';
      case Grade.C:       return 'blue';
      case Grade.C_MINUS: return 'blue';
      case Grade.D_PLUS:  return 'orange';
      case Grade.D:       return 'orange';
      case Grade.D_MINUS: return 'orange';
      case Grade.F:       return 'red';
      case Grade.XF:      return 'black';
      default:            return 'black';
    }
  }
}


/*
import { Component, OnInit, Input } from '@angular/core';

import { assert } from 'src/utils';

import { Grading } from '../../models/results.model';



@Component({
    selector: 'app-grading-line',
    templateUrl: './grading-line.component.html',
    styleUrl: './grading-line.component.scss'
})
export class GradingLineComponent implements OnInit {
    @Input()
    grading!: Grading;

    @Input!()
    key!: string;

    @Input()
    improvement?: number;

    // Options :
    @Input()
    withImprovement: boolean = false;

    ngOnInit(): void {
        if (this.withImprovement) {
            assert(this.improvement !== undefined);
        }
    }
}
*/