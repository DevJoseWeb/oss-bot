/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

interface Repo {
  org: string;
  name: string;
}

/**
 * Create a new config handler.
 * @param {object} config JSON config data.
 */
export class BotConfig {
  config: any;

  constructor(config: any) {
    this.config = config;
  }

  /**
   * Get a list of all configured repos.
   */
  getAllRepos() {
    const repos: Repo[] = [];

    for (const org in this.config) {
      for (const name in this.config[org]) {
        repos.push({
          org: org,
          name: name
        });
      }
    }

    return repos;
  }

  /**
   * Get the config object for a specific repo.
   */
  getRepoConfig(org: string, name: string) {
    const cleanOrg = this.sanitizeKey(org);
    const cleanName = this.sanitizeKey(name);
    if (this.config[cleanOrg] && this.config[cleanOrg][cleanName]) {
      return this.config[cleanOrg][cleanName];
    }
  }

  /**
   * Get the config object for a single label of a specific repo.
   */
  getRepoLabelConfig(org: string, name: string, label: string) {
    const repoConfig = this.getRepoConfig(org, name);

    const cleanLabel = this.sanitizeKey(label);
    if (repoConfig && repoConfig.labels && repoConfig.labels[cleanLabel]) {
      return repoConfig.labels[cleanLabel];
    }
  }

  /**
   * Get the templates configuration for a specific repo.
   */
  getRepoTemplateConfig(org: string, name: string, template: string) {
    const repoConfig = this.getRepoConfig(org, name);

    const cleanTemplate = this.sanitizeKey(template);
    if (
      repoConfig &&
      repoConfig.templates &&
      repoConfig.templates[cleanTemplate]
    ) {
      return repoConfig.templates[cleanTemplate];
    }
  }

  /**
   * Keys are sanitized before they are stored in config and therefore need
   * to be sanitized when retrieved.
   */
  sanitizeKey(key: string): string {
    let cleanKey = key;
    cleanKey = cleanKey.toLowerCase();
    cleanKey = cleanKey.trim();

    return cleanKey;
  }
}
