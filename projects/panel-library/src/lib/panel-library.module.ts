import { NgModule } from '@angular/core';
import { PanelLibraryComponent } from './panel-library.component';
import { forChild } from 'ngx-golden-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const TYPES = [{
  name: 'plugin-lib',
  type: PanelLibraryComponent,
}];

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatSelectModule,
    MatTooltipModule
  ],
  declarations: [PanelLibraryComponent],
  providers: [...forChild(TYPES)],
  exports: [PanelLibraryComponent],
  id: 'panel-library',
})
export class PanelLibraryModule { }
