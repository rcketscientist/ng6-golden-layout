import { NgModule } from '@angular/core';
import { DemoLibraryComponent } from './demo-library.component';
import { forChild } from 'ngx-golden-layout';


@NgModule({
  declarations: [DemoLibraryComponent],
  providers: [...forChild([{
    name: 'demo-library-component',
    type: DemoLibraryComponent,
  }])],
  exports: [DemoLibraryComponent]
})
export class DemoLibraryModule { }
