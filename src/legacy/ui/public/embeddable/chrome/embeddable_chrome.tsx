/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { EuiContextMenuPanelDescriptor } from '@elastic/eui';
import React from 'react';
import { Action } from 'ui/embeddable/actions';
import {
  buildEuiContextMenuPanels,
  ContextMenuAction,
  ContextMenuPanel,
} from 'ui/embeddable/context_menu_actions';
import { getTrigger, SHOW_EDIT_MODE_TRIGGER } from 'ui/embeddable/triggers';
import { SHOW_VIEW_MODE_TRIGGER } from 'ui/embeddable/triggers/trigger_registry';
import { ViewMode } from 'ui/embeddable/types';
import { Container } from '../containers';
import { Embeddable } from '../embeddables';
import { PanelHeader } from './panel_header/panel_header';

interface Props {
  embeddable: Embeddable;
  container: Container;
}

export class EmbeddableChrome extends React.Component<Props> {
  private embeddableRoot: React.RefObject<HTMLDivElement>;
  constructor(props: Props) {
    super(props);
    this.embeddableRoot = React.createRef();
  }

  public render() {
    return (
      <div>
        <PanelHeader
          getPanels={this.getPanels}
          hidePanelTitles={this.props.container.getOutput().hidePanelTitles}
          isViewMode={this.props.container.getOutput().viewMode === ViewMode.VIEW}
        />
        <div ref={this.embeddableRoot} />
      </div>
    );
  }

  public onComponentDidMount() {
    this.props.embeddable.render(this.embeddableRoot.current);
  }

  private async getPanels() {
    let panels: EuiContextMenuPanelDescriptor[] = [];

    const triggerId =
      this.props.container.getOutput().viewMode === ViewMode.EDIT
        ? SHOW_EDIT_MODE_TRIGGER
        : SHOW_VIEW_MODE_TRIGGER;

    const trigger = await getTrigger(triggerId);
    const actions = trigger.getCompatibleActions({
      embeddable: this.props.embeddable,
      container: this.props.container,
      triggerContext: {},
    });

    const contextMenuPanel = new ContextMenuPanel({
      title: 'Options',
      id: 'mainMenu',
    });

    const wrappedForContextMenu = actions.map((action: Action) => {
      return new ContextMenuAction<Embeddable, Container>(
        {
          id: action.id,
          displayName: action.title,
          parentPanelId: 'mainMenu',
        },
        {
          onClick: ({ embeddable, container }) => action.execute({ embeddable, container }),
        }
      );
    });

    // const contextMenuActions = [
    //   //   getInspectorPanelAction({
    //   //     closeContextMenu: closeMyContextMenuPanel,
    //   //     panelTitle,
    //   //   }),
    //   //  // getEditPanelAction(),
    //   // getToggleExpandPanelAction({ isExpanded, toggleExpandedPanel }),
    //   // getRemovePanelAction(onDeletePanel),
    // ]
    //   //   .concat(panelActionsStore.actions)
    //   .concat(wrappedForContextMenu);

    panels = buildEuiContextMenuPanels({
      contextMenuPanel,
      actions: wrappedForContextMenu,
      embeddable: this.props.embeddable,
      container: this.props.container,
    });
    return panels;
  }
}
