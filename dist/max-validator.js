!(function () {
  var t = function (t) {
      var e;
      return function (r) {
        return e || t((e = { exports: {}, parent: r }), e.exports), e.exports;
      };
    },
    e = t(function (t, e) {
      function i() {
        (this.validators = a),
          (this.messages = n),
          (this.ruleSeparator = '|'),
          (this.ruleParamSeparator = ':'),
          (this.paramsSeparator = ','),
          (this.defaultMessage = 'Incorrect Value');
      }
      (i.prototype.setMessages = function (t) {
        if ('object' != typeof t) throw 'Messages must be object';
        return (this.messages = Object.assign(this.messages, t)), this;
      }),
        (i.prototype.setDefaultMessage = function (t) {
          if ('object' != typeof t) throw 'Messages must be object';
          return (this.defaultMessage = t), this;
        }),
        (i.prototype.setRuleSeparator = function (t) {
          if ('string' != typeof t) throw 'Separator must be string';
          return (this.ruleSeparator = t), this;
        }),
        (i.prototype.setRuleParamSeparator = function (t) {
          if ('string' != typeof t) throw 'Separator must be string';
          return (this.ruleParamSeparator = t), this;
        }),
        (i.prototype.setParamsSeparator = function (t) {
          if ('string' != typeof t) throw 'Separator must be string';
          return (this.paramsSeparator = t), this;
        }),
        (i.prototype.extend = function (t, e, r = null) {
          if (void 0 !== this.validators[t]) throw 'Validator named ' + t + ' already exists';
          if ('function' != typeof e) throw 'Validator must be function';
          return (this.validators[t] = e), null !== r && this.setMessages({ [t]: r }), this;
        }),
        (i.prototype.getValidator = function (t) {
          if ('function' != typeof this.validators[t])
            throw 'Validator for ' + t + ' does not exists';
          return this.validators[t];
        }),
        (i.prototype.exists = function (t) {
          return 'function' == typeof this.validators[t];
        }),
        (i.prototype.formatMessage = function (t, e, r) {
          if (('object' != typeof e && (e = {}), (e.name = t), void 0 === this.messages[r]))
            return this.defaultMessage;
          var n = this.messages[r];
          return (
            Object.keys(e).map(function (t) {
              n = n.replace(':' + t, e[t]);
            }),
            n
          );
        }),
        (i.prototype.formatErrors = function (t, e) {
          return {
            hasError: Object.keys(t).length > 0,
            errors: t,
            isError: function (r, n) {
              return null == n ? void 0 !== t[r] : void 0 !== e[r] && -1 !== e[r].indexOf(n);
            },
            getError: function (e, r = !0) {
              return Array.isArray(t[e]) && 0 != t[e].length ? (r ? t[e].join(',') : t[e][0]) : '';
            },
          };
        }),
        (i.prototype.getEmpty = function () {
          return this.validate({}, {});
        }),
        (i.prototype.validate = function (t, e, n) {
          var a = r({}),
            i = {},
            s = {};
          if ('object' != typeof t || 'object' != typeof e)
            throw 'Both data and scheme must be object';
          var o = a.parseScheme(e);
          for (paramName in o) {
            s[paramName] = [];
            for (var u = 0, l = o[paramName].rules.length; u < l; u++) {
              var f = o[paramName].rules[u],
                m = f.validate(o[paramName], t[paramName], t),
                c = m.rule ? m.rule : f.name;
              if (!0 !== m) {
                if ('string' == typeof m) var p = m;
                else p = this.formatMessage(paramName, m, c);
                void 0 === i[paramName]
                  ? (i[paramName] = [p])
                  : -1 === i[paramName].indexOf(p) && i[paramName].push(p),
                  s[paramName].push(c);
              }
            }
          }
          return (t = this.formatErrors(i, s)), 'function' == typeof n && n(t), t;
        }),
        (t.exports = new i());
    }),
    r = t(function (t, r) {
      var n = e({}),
        a = ['required', 'string', 'nullable', 'number'];
      function i(t) {
        'string' == typeof t
          ? ((this.name = t),
            (this.isInlineFunction = !1),
            -1 === a.indexOf(t) && (this.validator = n.getValidator(this.name)))
          : 'function' == typeof t &&
            ((this.name = t.name || 'default'), (this.isInlineFunction = !0), (this.validator = t)),
          (this.params = []);
      }
      (i.prototype.validate = function (t, e, r) {
        if (null == e || null == e || '' == e) {
          if (t.isRequired) return { rule: 'required' };
          if (t.isNullable) return !0;
        }
        return (
          t.isNumber ? (e = parseFloat(e)) : t.isString && (e = String(e)),
          this.isInlineFunction ? this.validator(e, r) : this.validator(e, ...this.params)
        );
      }),
        (i.prototype.setParams = function (t = []) {
          return (this.params = t), this;
        }),
        (i.parseScheme = function (t) {
          const e = {};
          for (name in t) {
            var r = t[name],
              n = {};
            if ('string' == typeof r) n = i.parseStringRules(r);
            else if (Array.isArray(r)) n = i.parseArrayRules(r);
            else {
              if ('object' != typeof r) throw 'Invalid rules for ' + name;
              n = i.parseRulesObject(r);
            }
            for (
              var s = void 0 !== n.required,
                o = void 0 !== n.string,
                u = void 0 !== n.number,
                l = void 0 !== n.nullable,
                f = 0;
              f < a.length;
              f++
            )
              delete n[a[f]];
            e[name] = {
              rules: Object.values(n),
              isRequired: s,
              isString: o,
              isNumber: u,
              isNullable: l,
            };
          }
          return e;
        }),
        (i.parseArrayRules = function (t) {
          var e = {},
            r = 100;
          return (
            t.map(function (t) {
              if (null != t && '' != t)
                if ('string' == typeof t) {
                  var n = i.parseStringRules(t);
                  Object.assign(e, n);
                } else if ('function' == typeof t) {
                  var a = t.name.length > 0 ? t.name : r++,
                    s = new i(t);
                  e[a] = s;
                }
            }),
            e
          );
        }),
        (i.parseRulesObject = function (t) {
          var e = {},
            r = 100;
          return (
            Object.keys(t).map(function (n) {
              var a = t[n];
              if ('function' == typeof a) {
                var s = a.name.length > 0 ? a.name : r++,
                  o = new i(a);
                e[s] = o;
              } else {
                var u = Array.isArray(a) ? a : [a];
                (o = new i(n).setParams(u)), (e[n] = o);
              }
            }),
            e
          );
        }),
        (i.parseStringRules = function (t) {
          var e = {};
          return (
            t
              .split(n.ruleSeparator)
              .filter(function (t) {
                return '' !== t;
              })
              .map(function (t) {
                var r = t.split(n.ruleParamSeparator),
                  a = r[0].trim(),
                  s = new i(a),
                  o = r[1],
                  u = void 0 !== o ? o.split(n.paramsSeparator) : [];
                s.setParams(u), (e[a] = s);
              }),
            e
          );
        }),
        (t.exports = i);
    }),
    n = {
      required: ':name is required',
      min: ':name cant be less than :min',
      max: ':name cant be greater than :max',
      between: ':name must be between :from and :to',
      checked: ':name must be checked',
      array: ':name must be array',
      object: ':name must be object',
      boolean: ':name must be boolean',
      array: ':name must be array',
      numeric: ':name can only contain digits',
      alpha_numeric: ':name can only contain digits and letters',
      alpha_dash: ':name can only contain letters and dashes',
      alpha: ':name can only contain leters',
      email: ':name must be correct mail',
      in_array: ':name is invalid',
      not_in: ":name can't be :value",
      json: ':name must be valid json',
      ip: ':name must be valid ip adress',
      url: ':name must be valid url',
      equals: ':name must equal to :value',
      not_equals: ":name can't be :value",
      contains_one: ':name must contain ":value_to_contain"',
      contains_all: ':name must contain ":value_to_contain"',
      starts_with: ':name must start with :prefix',
      ends_with: ':name must end with :suffix',
      date: ':name must valid date',
    },
    a = {
      min: function (t, e) {
        var r = { min: e };
        if ('string' == typeof t) {
          if (t.length >= e) return !0;
        } else if (void 0 !== typeof t && t >= e) return !0;
        return r;
      },
      max: function (t, e) {
        var r = { max: e };
        if ('string' == typeof t) {
          if (t.length <= e) return !0;
        } else if (void 0 !== typeof t && t <= e) return !0;
        return r;
      },
      between: function (t, e, r) {
        var n = { from: e, to: r, value: t };
        if ('string' == typeof t) {
          if (t.length >= e && t.length <= r) return !0;
        } else if (t >= e && t <= r) return !0;
        return n;
      },
      checked: function (t) {
        return 1 == t || 'on' == t || 1 == t || 'true' == t || {};
      },
      object: function (t) {
        return 'object' == typeof t || {};
      },
      array: function (t) {
        return !!Array.isArray(t) || {};
      },
      boolean: function (t) {
        return 'boolean' == typeof t || {};
      },
      numeric: function (t) {
        var e = { value: t };
        return !!/^\d+$/.test(t) || e;
      },
      alpha_numeric: function (t) {
        var e = { value: t };
        return !!/^[A-Za-z0-9]+$/.test(t) || e;
      },
      alpha: function (t) {
        var e = { value: t };
        return !!/^[a-zA-Z]+$/.test(t) || e;
      },
      email: function (t) {
        var e = { value: t };
        return (
          !!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            t
          ) || e
        );
      },
      alpha_dash: function (t) {
        var e = { value: t };
        return !!/^[A-Za-z\-]+$/.test(t) || e;
      },
      in_array: function (t, ...e) {
        var r = { value: e.join(',') };
        return e.indexOf(String(t)) > -1 || r;
      },
      not_in: function (t, ...e) {
        var r = { value: t };
        return -1 === e.indexOf(String(t)) || r;
      },
      json: function (t) {
        try {
          return JSON.parse(String(t)), !0;
        } catch (e) {
          return {};
        }
      },
      ip: function (t) {
        var e = { value: t };
        return (
          !!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
            t
          ) || e
        );
      },
      url: function (t) {
        try {
          new URL(t);
        } catch (e) {
          return {};
        }
        return !0;
      },
      equals: function (t, e) {
        var r = { value: e };
        return String(t) == e || r;
      },
      not_equals: function (t, e) {
        var r = { value: e };
        return String(t) != e || r;
      },
      starts_with: function (t, e) {
        var r = { prefix: e };
        return (e = String(e)), 0 === (t = String(t)).indexOf(e) || r;
      },
      contains_one: function (t, ...e) {
        var r = { value_to_contain: e.join(',') };
        Array.isArray(t) || (t = String(t));
        for (var n = 0, a = e.length; n < a; n++) if (t.indexOf(e[n]) > -1) return !0;
        return r;
      },
      contains_all: function (t, ...e) {
        Array.isArray(t) || (t = String(t));
        for (var r = 0, n = e.length; r < n; r++)
          if (-1 == t.indexOf(e[r])) return { value_to_contain: e[r] };
        return !0;
      },
      ends_with: function (t, e) {
        var r = { suffix: e };
        return (e = String(e)), -1 !== (t = String(t)).indexOf(e, t.length - e.length) || r;
      },
      date: function (t) {
        return NaN !== Date.parse(t) || {};
      },
    };
  e({});
})();
