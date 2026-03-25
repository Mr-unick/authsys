import { haspermission } from "./authorization";
import { PaginationInstance, TablePropsResponseInstance } from "./instances";

interface TableInput {
  name: string;
  data: Array<Record<string, any>>;
}

/**
 * Builder class for generating table configurations for the frontend.
 * Uses the Builder pattern for fluent API.
 */
export class GenerateTable {
  private newtable: TablePropsResponseInstance;

  constructor(table: TableInput) {
    this.newtable = {
      name: table.name,
      title: `${table.name} Details`,
      update: false,
      delete: false,
      view: false,
      create: false,
      assign: false,
      createform: {},
      updateform: {},
      formtype: 'modal',
      rows: table.data.length > 0 ? table.data : [],
      columns: table.data.length > 0 ? Object.keys(table.data[0]) : [],
      pagination: null,
    };
  }

  addform(url: string, formtype: string = 'modal'): this {
    this.newtable.createform = {
      method: 'post',
      formurl: url,
    };
    this.newtable.updateform = {
      method: 'put',
      formurl: url,
    };
    return this;
  }

  formtype(type: string): this {
    this.newtable.formtype = type;
    return this;
  }

  policy(user: any, policy: string): this {
    this.newtable.update = haspermission(user, `update_${policy}`);
    this.newtable.create = haspermission(user, `create_${policy}`);
    this.newtable.delete = haspermission(user, `delete_${policy}`);
    this.newtable.view = haspermission(user, `view_${policy}`);
    this.newtable.assign = haspermission(user, `assign_${policy}`);

    const policyLog = `[${new Date().toISOString()}] POLICY_CHECK: ${policy}, Create: ${this.newtable.create}, Assign: ${this.newtable.assign}\n`;
    try {
        const fs = require('fs');
        const path = require('path');
        fs.appendFileSync(path.join(process.cwd(), 'api_debug.log'), policyLog);
    } catch (e) {}

    return this;
  }

  addPagination(pagination: PaginationInstance): this {
    this.newtable.pagination = pagination;
    return this;
  }

  gettable(): TablePropsResponseInstance {
    return this.newtable;
  }
}
