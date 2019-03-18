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

import React from 'react';
import { Provider } from 'react-redux';
// @ts-ignore
import { DashboardViewportContainer } from './dashboard_viewport_container';

import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import { EmbeddableFactory } from 'ui/embeddable';
import { DashboardContainer } from '..';
import { resetState } from '../redux/actions';
import { DashboardState } from '../redux/selectors';

const enhancers = [applyMiddleware(thunk)];

import { dashboard } from '../redux/reducers';

/**
 * Only a single reducer now, but eventually there should be one for each sub app that is part of the
 * core kibana plugins.
 */
// export const reducers = combineReducers<DashboardState>(dashboard);

export function DashboardViewportProvider(props: {
  getEmbeddableFactory: <I, O>(type: string) => EmbeddableFactory<I, O>;
  container: DashboardContainer;
}) {
  const store = createStore(dashboard, props.container.getInput(), compose(...enhancers));

  store.subscribe(() => {
    const newState = store.getState();
    // @ts-ignore
    props.container.onInputChanged(newState);
  });

  props.container.onOutputChanged((output: DashboardState) => {
    store.dispatch(resetState(output));
  });

  return (
    <Provider store={store}>
      <DashboardViewportContainer {...props} />
    </Provider>
  );
}
