import { Inject, Injectable, Type, Optional } from '@angular/core';
import * as GoldenLayout from 'golden-layout';
import { GoldenLayoutConfiguration, ComponentConfiguration } from './config';
import { GoldenLayoutStateStore, StateStore } from './state';
import { GoldenLayoutComponent } from './golden-layout.component';

/**
 * golden-layout component initialization callback type.
 */
export type ComponentInitCallback = (container: GoldenLayout.Container, componentState: any) => void;

export interface ComponentInitCallbackFactory {
  createComponentInitCallback(component: Type<any>): ComponentInitCallback;
}

@Injectable()
export class GoldenLayoutService {
  private _layout: GoldenLayout = null;

  constructor(@Inject(GoldenLayoutConfiguration) public readonly config: GoldenLayoutConfiguration,
              @Optional() @Inject(GoldenLayoutStateStore) private readonly stateStore: StateStore) {}

  public initialize(goldenLayout: GoldenLayout, componentInitCallbackFactory: ComponentInitCallbackFactory) {
    this._layout = goldenLayout;
    this.config.components.forEach((componentConfig: ComponentConfiguration) => {
      const componentInitCallback = componentInitCallbackFactory.createComponentInitCallback(componentConfig.component);
      goldenLayout.registerComponent(componentConfig.componentName, componentInitCallback);
    });

    if (this.stateStore) {
      (<GoldenLayout.EventEmitter>(<any>goldenLayout)).on('stateChanged', () => {
        this._saveState(goldenLayout);
      });
    }
  }

  private _saveState(goldenLayout: GoldenLayout): void {
    if (this.stateStore && goldenLayout.isInitialised) {
      try {
        this.stateStore.writeState(goldenLayout.toConfig());    // TODO: efficient? http://golden-layout.com/tutorials/saving-state.html
      } catch (ex) {
        // Workaround for https://github.com/deepstreamIO/golden-layout/issues/192
      }
    }
  }

  public getState(): Promise<any> {
    if (this.stateStore) {
      return this.stateStore.loadState().catch(() => {
        return this.config.defaultLayout;
      });
    }

    return Promise.resolve(this.config.defaultLayout);
  }

  public loadState(config: GoldenLayoutConfiguration) {
    this._layout.config = config.defaultLayout;
    // FIXME: We have not addressed the component registry!  Honestly, this might not work anyway.
    // again we want to resolve components in the service not the component
    // this.config.components.forEach((componentConfig: ComponentConfiguration) => {
    //   const componentInitCallback = componentInitCallbackFactory.createComponentInitCallback(componentConfig.component);
    //   goldenLayout.registerComponent(componentConfig.componentName, componentInitCallback);
    // });
    this._layout.init();
  }

  public getRegisteredComponents(): ComponentConfiguration[] {
    return this.config.components;
  }

  /**
  * Registers a component that can be injected as a tab.  AJM: I dislike leveraging the component, but for now I'm going for minimal change.
  * Ideally, the service will resolve the component, however, that might have issues later on with popout MDI (multiple GL)...pros and cons
  * @param name 	The name of the component, as referred to by componentName in the component configuration.
  * @param name 	The name of the component, as referred to by componentName in the component configuration.
  * @param component 	A constructor or factory function. Will be invoked with new and two arguments, a containerobject and a component state
  */
  public registerComponent(host: GoldenLayoutComponent, name: String, componentType: Type<any>): void {
    const compCallback = host.createComponentInitCallback(componentType);
    this._layout.registerComponent(name, compCallback);
  }

  /**
   * AJM: Why createContentItem at the first slot every time, as opposed to addChild, etc.
   * @param comp pulls 'name'...seems overly complex...
   * @param title tab title
   * @param state componentState
   */
  public createNewComponent(comp: ComponentConfiguration, title?: string, state?: any) {
    // create content item
    const content = this._layout.createContentItem({
      type: 'component',
      componentName: comp.componentName,
      componentState: state,
      title: title,
    }) as any;
    // search for the first lm-stack (a stack should be there always.)
    const root = this._layout.root;
    let element: GoldenLayout.ContentItem = null;
    if (!root.contentItems || root.contentItems.length === 0) {
      element = root;
    } else {
      element = this.findStack(root.contentItems);
    }
    if (element === null) {
      throw new Error('this should never happen!');
    }
    element.addChild(content);
  }

  private findStack(contentItems: GoldenLayout.ContentItem[]): GoldenLayout.ContentItem {
    if (!contentItems) {
      return null;
    }
    for (const x of contentItems) {
      if (x.type === 'stack') {
        return x;
      }
      const s = this.findStack(x.contentItems);
      if (s !== null) {
        return s;
      }
    }
  }

  public isChildWindow(): boolean {
    try {
      return !!window.opener && !!window.opener.location.href;
    } catch (e) {
      return false;
    }
  }

  public getRootWindow(): Window {
    return this.isChildWindow() ? window.opener : window;
  }
}
