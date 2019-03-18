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

import { InjectedIntl, injectI18n } from '@kbn/i18n/react';
import React from 'react';

import {
  EuiButtonIcon,
  EuiContextMenu,
  EuiContextMenuPanelDescriptor,
  EuiPopover,
} from '@elastic/eui';

export interface PanelOptionsMenuProps {
  getPanels: () => Promise<EuiContextMenuPanelDescriptor[]>;
  isViewMode: boolean;
}

interface PanelOptionsMenuUiProps extends PanelOptionsMenuProps {
  intl: InjectedIntl;
}

interface State {
  panels: EuiContextMenuPanelDescriptor[];
  isPopoverOpen: boolean;
}

class PanelOptionsMenuUi extends React.Component<PanelOptionsMenuUiProps, State> {
  constructor(props: PanelOptionsMenuUiProps) {
    super(props);
    this.state = {
      panels: [],
      isPopoverOpen: false,
    };
  }

  public async componentDidMount() {
    // const panels = await this.props.getPanels();
    // this.setState({ panels });
  }

  public async componentDidUpdate(prevProps: PanelOptionsMenuProps) {
    // if (this.state.isPopoverOpen && !prevProps.isPopoverOpen) {
    this.setState({ panels: [] });
    const panels = await this.props.getPanels();
    this.setState({ panels });
    // }
  }

  public render() {
    const { isViewMode, intl } = this.props;
    const button = (
      <EuiButtonIcon
        iconType={isViewMode ? 'boxesHorizontal' : 'gear'}
        color="text"
        className="dshPanel_optionsMenuButton"
        aria-label={intl.formatMessage({
          id: 'kbn.dashboard.panel.optionsMenu.panelOptionsButtonAriaLabel',
          defaultMessage: 'Panel options',
        })}
        data-test-subj="dashboardPanelToggleMenuIcon"
        onClick={this.toggleContextMenu}
      />
    );

    return (
      <EuiPopover
        id="dashboardPanelContextMenu"
        className="dshPanel_optionsMenuPopover"
        button={button}
        isOpen={this.state.isPopoverOpen}
        closePopover={this.closePopover}
        panelPaddingSize="none"
        anchorPosition="downRight"
        data-test-subj={
          this.state.isPopoverOpen
            ? 'dashboardPanelContextMenuOpen'
            : 'dashboardPanelContextMenuClosed'
        }
        withTitle
      >
        <EuiContextMenu initialPanelId="mainMenu" panels={this.state.panels} />
      </EuiPopover>
    );
  }
  private closePopover = () => {
    this.setState({
      isPopoverOpen: false,
    });
  };
  private toggleContextMenu = () => {
    this.setState(
      {
        isPopoverOpen: !this.state.isPopoverOpen,
      },
      async () => {
        if (this.state.isPopoverOpen) {
          this.setState({ panels: [] });
          const panels = await this.props.getPanels();
          this.setState({ panels });
        }
      }
    );
  };
}

export const PanelOptionsMenu = injectI18n(PanelOptionsMenuUi);
