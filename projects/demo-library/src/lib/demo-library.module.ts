import { NgModule } from '@angular/core';
import { DemoLibraryComponent } from './demo-library.component';
import { forChild } from 'ngx-golden-layout';

import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
  imports: [
    MatTooltipModule
  ],
  declarations: [DemoLibraryComponent],
  providers: [...forChild([{
    name: 'demo-library-component',
    type: DemoLibraryComponent,
  }])],
  exports: [DemoLibraryComponent]
})
export class DemoLibraryModule { }
