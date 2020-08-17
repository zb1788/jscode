<script type="text/jsx">
import VcomMenuTree from '../../components/MenuTree';
import VcomAreaSelect from '../../components/AreaSelect';
import SuiteAreaSelect from '@/components/SuiteAreaSelect';
import { isEmpty, typeOf } from '../../utils/object';
import { forEach } from '../../utils/tree';

export default {
  name: 'vcom-form',
  components: {
    VcomMenuTree,
    VcomAreaSelect,
    SuiteAreaSelect
  },

  props: {
    labelWidth: {
      type: String,
      default: () => ''
    },
    inLine: {
      type: Boolean,
      default: () => false
    },
    value: {
      default: () => {
        return {};
      }
    },
    items: {
      type: Array,
      default: () => []
    },
    width: {
      type: String,
      default: () => ''
    }
  },

  data () {
    return {
      validated: false,
      validateError: {},
      cache: {}
    };
  },

  render (createElement, context) {
    return this.items &&
      <div class="vcom-form">
        {this.items.map(item => <vcom-form-item
          key={item.field || item.label}
          label={`${item.label ? `${item.label}${item.semicolon === false ? '' : '：'}` : ''}`}
          in-line={item.inLine || this.inLine}
          label-width={item.labelWidth || this.labelWidth}
          required={item.required}
          error={(this.validateError[item.field] || {}).__error}
          error-text={(this.validateError[item.field] || {}).__errorText}
        >
          {item.preRender &&
            <span class="vcom-form-item-sub">
              {item.preRender(createElement, item, this.value)}
            </span>
          }
          {!item.render &&
              this.switchRenderFunc(item)(item)
          }
          {item.render &&
              item.render(createElement, item, this.value)
          }
          {item.subRender &&
              <span class="vcom-form-item-sub">
                {item.subRender(createElement, item, this.value)}
              </span>
          }
          { typeof item.label === 'object' &&
              <span slot="label">
                {!item.label.render &&
                  this.switchRenderFunc(item.label)(item.label)
                }
                {item.label.render &&
                  item.label.render(createElement, item.label, this.value)
                }
                ：
              </span>
          }
        </vcom-form-item>)
        }
        {this.$scopedSlots.default &&
        this.$scopedSlots.default()}
      </div>;
  },

  methods: {
    renderInput (item) {
      const { field, label, width, showPassword, onFocus, validators, ...attrs } = item || {};
      return <yj-input
        {...{ attrs: { ...attrs
        } }
        }
        {...{ props: { ...attrs
        } }
        }
        v-model={this.value[item.field]}
        show-password={showPassword}
        clearable={true}
        onFocus={() => {
          onFocus && onFocus();
        }}
        onInput={(val) => {
          this.$forceUpdate();
        }}
        onBlur={() => {
          let val = this.value[field] || '';
          if (typeOf(val) === 'String' && !item.isBlank) {
            // this.value[item.field] = val.replace(/\s+/g, '');
            this.value[item.field] = val.trimLeft().trimRight();
          }
        }}
        style={(width || this.width) ? `width: ${width || this.width}` : ''}
      />;
    },

    renderNumber (item) {
      const { field, label, width, ...attrs } = item || {};

      return <yj-input
        {...{ attrs: { ...attrs
        } }
        }
        {...{ props: { ...attrs
        } }
        }
        type="number"
        clearable
        v-model={this.value[item.field]}
        style={(width || this.width) ? `width: ${width || this.width}` : ''}
      />;
    },

    renderRadio (item) {
      const { field, placeholder, disabled, width, options, onChange } = item || {};

      return <yj-radio-group
        v-model={this.value[field]}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange || (() => { return {}; })}
        style={`width: ${!width ? '' : width}`}
      >
        {options && options.map(opt => <yj-radio label={opt.value}>{opt.label}</yj-radio>)}
      </yj-radio-group>;
    },

    renderCheckbox (item) {
      const { field, options, placeholder, disabled, width, onChange } = item || {};
      return <yj-checkbox-group
        v-model={this.value[field]}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange || (() => { return {}; })}
        style={`width: ${!width ? '' : width}`}
      >
        {options && options.map(opt => <yj-checkbox label={opt.value} disabled={opt.disabled}>{opt.label}</yj-checkbox>)}
      </yj-checkbox-group>;
    },

    renderSelect (item) {
      const {
        field,
        options,
        placeholder,
        disabled,
        width,
        filterable,
        multiple,
        remoteMethod,
        onFocus,
        onChange,
        onClear,
        valueKey,
        clearable
      } = item || {};
      let oldVal = this.value[field];

      const KEY = `ref-${field}-select`,

        ref = this.$refs[KEY];
      if (ref) {
        ref.$el.addEventListener('click', (e) => {
          e.preventDefault();
        }, false);
      }
      let optionsList = (options && options.length > 0 && options.map((opt) => { return { id: opt.value, name: opt.label }; })) || [];
      return <el-select
        ref={KEY}
        v-model={this.value[field]}
        placeholder={placeholder}
        disabled={disabled}
        filterable={filterable}
        multiple={multiple}
        clearable={clearable === undefined || clearable === true}
        loading={this.cache[KEY]}
        loading-text="正在加载"
        no-data-text="暂无数据"
        remote={!!remoteMethod}
        remote-method={async (query) => {
          this.$set(this.cache, KEY, true);
          if (query && remoteMethod) {
            await remoteMethod(query);
          }

          const timer = window.setTimeout(() => {
            this.$set(this.cache, KEY, false);
            window.clearTimeout(timer);
          }, 1000);
        }}
        value-key={valueKey}
        onFocus={() => {
          onFocus && onFocus();
        }}
        onChange={(val) => {
          onChange && onChange(val, oldVal);
          val && (oldVal = val);
        }}
        onClear={() => {
          onClear && onClear(oldVal);
        }}
        style={`width: ${!width ? '' : width}`}
        list = { optionsList }

      >
        {
          optionsList && optionsList.map((listItem) => <el-option label={listItem.name} value={listItem.id}></el-option>
          )
        }
      </el-select>;
    },

    renderArea (item) {
      const {
        field, showLabel, disabled, length, width, defaultAreaId, onChange = () => void 0
      } = item;
      return <vcom-area-select
        v-model={this.value[field]}
        length={length}
        show-label={showLabel}
        disabled={disabled}
        defaultAreaId={defaultAreaId}
        onChange={onChange}
        style={`width: ${!width ? '' : width}`}
      />;
    },

    renderTextarea (item) {
      const { field, placeholder, autosize, width, rows, showWordLimit, maxlength } = item;
      return <yj-input
        v-model={this.value[field]}
        type="textarea"
        autosize={autosize}
        placeholder={placeholder}
        rows={rows}
        showWordLimit={showWordLimit}
        maxlength={maxlength}
        style={(width || this.width) ? `width: ${width || this.width}` : ''}
      />;
    },

    renderDate (item) {
      const {
        field,
        ...attrs
      } = item;

      return <yj-date-picker
        v-model={this.value[field]}
        {...{ attrs: { ...attrs
        } }
        }
        {...{ props: { ...attrs
        } }
        }
        clearable
      />;
    },

    switchRenderFunc (item) {
      const [ , func ] = [
        [ [ 'input' ], this.renderInput ],
        [ [ 'number' ], this.renderNumber ],
        [ [ 'textarea' ], this.renderTextarea ],
        [ [ 'radio' ], this.renderRadio ],
        [ [ 'checkbox' ], this.renderCheckbox ],
        [ [ 'select' ], this.renderSelect ],
        [ [ 'area' ], this.renderArea ],
        [ [ 'year',
          'month',
          'date',
          'dates',
          'week',
          'datetime',
          'datetimerange',
          'daterange',
          'monthrange'
        ], this.renderDate ]
      ]
        .find(([ types ]) => types.includes(item.type)) || [];

      return func || this.renderInput;
    },

    /**
     * 表单验证
     * @returns {boolean}
     */
    validator () {
      this.validated = true;
      for (let key in this.items) {
        const item = this.items[key] || {},
          value = this.value[item.field];
        if (!item || !item.field) { continue; }

        if (item.required && isEmpty(value)) {
          this.$set(this.validateError, item.field, {
            __errorText: item.requiredErrorText || `${item.label || ''}不能为空`,
            __error: true
          });
          return false;
        }

        for (let validator of (item.validators || [])) {
          const { regExp, func, errorText, async } = validator || {};
          if (item.required) {
            if (
              !async && ((regExp && !regExp.test(value)) ||
              (func && !func(value)))
            ) {
              this.$set(this.validateError, item.field, {
                __errorText: errorText,
                __error: true
              });
              return false;
            }
          } else {
            if (value) {
              if (
                (regExp && !regExp.test(value)) ||
                (func && !func(value))
              ) {
                this.$set(this.validateError, item.field, {
                  __errorText: errorText,
                  __error: true
                });
                return false;
              }
            }
          }
        }
        this.$set(this.validateError, item.field, {});
      }

      let childrenForm = [];
      forEach(this.$children, (item) => {
        typeOf(item.validator) === 'Function' &&
          childrenForm.push(item);
      }, [], '$children');

      for (let form of childrenForm) {
        if (!form.validator()) {
          return false;
        }
      }
      return true;
    },
    /**
     * 表单验证 异步
     * @returns {boolean}
     */
    async validatorSync () {
      this.validated = true;
      for (let key in this.items) {
        const item = this.items[key] || {},
          value = this.value[item.field];
        if (!item || !item.field) { continue; }

        if (item.required && isEmpty(value)) {
          this.$set(this.validateError, item.field, {
            __errorText: item.requiredErrorText || `${item.label || ''}不能为空`,
            __error: true
          });
          return false;
        }

        for (let validator of (item.validators || [])) {
          const { regExp, func, errorText } = validator || {};

          if (
            (regExp && !regExp.test(value)) ||
            // eslint-disable-next-line
            (func && !(await func(value)))
          ) {
            this.$set(this.validateError, item.field, {
              __errorText: errorText,
              __error: true
            });
            return false;
          }

          this.$set(this.validateError, item.field, {});
        }
      }
      return true;
    }
  },

  watch: {
    value: {
      handler () {
        this.validated && this.validator();
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.vcom-form {
  .vcom-form-item {
    &-sub {
      margin-left: 12px;
    }
    .vcom-form-item {
      padding: 5px;
    }
  }
}
</style>
