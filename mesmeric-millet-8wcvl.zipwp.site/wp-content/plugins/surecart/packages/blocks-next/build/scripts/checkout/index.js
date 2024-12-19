import * as e from "@wordpress/interactivity";
var t, o, n = {
        d: function(e, t) {
            for (var o in t) n.o(t, o) && !n.o(e, o) && Object.defineProperty(e, o, {
                enumerable: !0,
                get: t[o]
            })
        },
        o: function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }
    },
    r = (t = {
        getContext: function() {
            return e.getContext
        },
        getElement: function() {
            return e.getElement
        },
        store: function() {
            return e.store
        }
    }, o = {}, n.d(o, t), o);
const {
    __,
    sprintf: i,
    _n
} = wp.i18n, c = "surecart-local-storage", s = function() {
    let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "live",
        t = arguments.length > 1 ? arguments[1] : void 0;
    const o = localStorage.getItem(c),
        n = {
            live: {},
            test: {}
        },
        r = (JSON.parse(o) || n)[e];
    return r ? .[t] || n
}, u = e => "keydown" === e.type && "Enter" !== e.key && "Space" !== e.code, a = e => {
    const t = document.querySelector ? .(e) || null;
    t && setTimeout((() => {
        t.focus()
    }), 0)
}, {
    state: l,
    actions: d
} = (0, r.store)("surecart/checkout", {
    state: {
        loading: !1,
        error: null,
        promotionCode: "",
        checkout: {},
        oldCheckout: {},
        get itemsCount() {
            return l.checkout ? .line_items_count || 0
        },
        get hasItems() {
            return l.itemsCount > 0
        },
        get discountIsRedeemable() {
            return "redeemable" === l ? .checkout ? .discount ? .redeemable_status
        },
        get lineItemHasScratchAmount() {
            const {
                line_item: e
            } = (0, r.getContext)();
            return !e ? .ad_hoc_amount && e.price.scratchAmount !== e.price.amount
        },
        get isDiscountApplied() {
            return !!l ? .checkout ? .discount ? .promotion ? .code
        },
        get checkoutLineItems() {
            return l.checkout ? .line_items ? .data || []
        },
        get isEditable() {
            const {
                line_item: e
            } = (0, r.getContext)();
            return !e ? .price ? .ad_hoc && !e ? .bump_amount
        },
        get hasSubscription() {
            return (l.checkout ? .line_items ? .data || []).some((e => "month" === e ? .price ? .recurring_interval && !!e ? .price ? .recurring_interval && !e ? .price ? .recurring_period_count))
        },
        get hasRecurring() {
            return l ? .checkout ? .line_items ? .data ? .some((e => e ? .price ? .recurring_interval))
        },
        get errorTitle() {
            return l.error ? .title || l.error || ""
        },
        get errorMessage() {
            return l.error ? .message || ""
        },
        get lineItemPermalink() {
            const {
                line_item: e
            } = (0, r.getContext)(), t = e ? .price ? .product;
            return t ? .is_published ? t ? .permalink : null
        },
        get additionalErrors() {
            return (l ? .error ? .additional_errors || []).map((e => e.message))
        },
        get showCartMenuIcon() {
            const {
                cartMenuAlwaysShown: e
            } = (0, r.getContext)();
            return l.itemsCount > 0 || e
        },
        get itemsCountAriaLabel() {
            const e = l.itemsCount;
            return i(_n( /* translators: %d: number of items in the cart */
                "Total of %d item in the cart", "Total of %d items in the cart", e, "surecart"), e)
        },
        get lineItemVariant() {
            const {
                line_item: e
            } = (0, r.getContext)();
            return (e ? .variant_options || []).filter(Boolean).join(" / ") || null
        }
    },
    callbacks: {
        getState() {
            let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
            return null === e ? (0, r.getContext)() : (0, r.getContext)() ? .[e] || !1
        },
        init() {
            const {
                mode: e,
                formId: t
            } = (0, r.getContext)(), o = s(e, t);
            d.setCheckout(o, e, t)
        },
        syncTabs(e) {
            if (e ? .key !== c) return;
            const {
                mode: t,
                formId: o
            } = (0, r.getContext)(), n = s(t, o);
            d.setCheckout(n, t, o)
        },
        onChangeCheckout: function*() {
            const {
                checkout: e,
                oldCheckout: t
            } = l;
            if (JSON.stringify(e ? .line_items ? .data || []) === JSON.stringify(t ? .line_items ? .data || [])) return;
            const {
                processCheckoutEvents: o
            } = yield
            import ("@surecart/checkout-events");
            o(e, t)
        }
    },
    actions: {
        toggleDiscountInput(e) {
            if (u(e)) return !0;
            e.preventDefault();
            const t = (0, r.getContext)();
            t.discountInputOpen = !t.discountInputOpen;
            const {
                ref: o
            } = (0, r.getElement)(), n = o ? .parentElement ? .querySelector ? .("input");
            n && setTimeout((() => n.focus()), 0)
        },
        setPromotionCode(e) {
            l.promotionCode = e ? .target ? .value || ""
        },
        maybeApplyDiscountOnKeyChange(e) {
            if ("Escape" !== e.key && "Enter" !== e.key || (e.preventDefault(), e.stopPropagation()), "Escape" === e.key) return (0, r.getContext)().discountInputOpen = !1, void a("#sc-coupon-trigger");
            "Enter" === e.key && d.applyDiscount(e), d.setPromotionCode(e)
        },
        applyDiscount: function*(e) {
            if (e.preventDefault(), e.stopPropagation(), !l.promotionCode) return;
            const {
                mode: t,
                formId: o
            } = (0, r.getContext)(), {
                speak: n
            } = yield
            import ("@surecart/a11y");
            n(__("Applying promotion code.", "surecart"), "assertive");
            const {
                handleCouponApply: c
            } = yield
            import ("@surecart/checkout-service"), s = yield* c(l.promotionCode);
            s && (n(i( /* translators: %s: promotion code */
                __("Promotion code %s has been applied.", "surecart"), l.promotionCode), "assertive"), l.error = "", d.setCheckout(s, t, o), a("#sc-coupon-remove-discount"))
        },
        removeDiscount: function*() {
            const e = (0, r.getContext)(),
                {
                    mode: t,
                    formId: o
                } = e,
                {
                    speak: n
                } = yield
            import ("@surecart/a11y");
            n(__("Removing promotion code.", "surecart"), "assertive");
            const {
                handleCouponApply: i
            } = yield
            import ("@surecart/checkout-service"), c = yield* i(null);
            c && (l.promotionCode = "", e.discountInputOpen = !1, d.setCheckout(c, t, o), n(__("Promotion code has been removed.", "surecart"), "assertive"), a("#sc-coupon-trigger"))
        },
        closeCouponOnClickOutside: e => {
            const t = (0, r.getContext)();
            e && e.target.closest(".sc-coupon-form") || t.discountInputOpen && (t.discountInputOpen = !1)
        },
        setCheckout(e, t, o) {
            let n = s(t, o);
            if (!n) return;
            l.oldCheckout = n;
            let r = JSON.parse(localStorage.getItem(c));
            r || (r = {
                live: {},
                test: {}
            }), t && e ? .live_mode === ("live" === t) && (r = { ...r,
                [t]: { ...r[t],
                    [o]: e
                }
            }, localStorage.setItem(c, JSON.stringify(r)), l.checkout = s(t, o))
        },
        onQuantityIncrease: function*(e) {
            if (u(e)) return !0;
            const {
                line_item: t
            } = (0, r.getContext)(), o = t ? .quantity + 1;
            yield d.updateLineItem({
                quantity: o
            });
            const {
                speak: n
            } = yield
            import ("@surecart/a11y");
            n(i( /* translators: %d: quantity */
                __("Quantity increased to %d.", "surecart"), o), "assertive")
        },
        onQuantityDecrease: function*(e) {
            if (u(e)) return !0;
            const {
                line_item: t
            } = (0, r.getContext)(), o = t ? .quantity - 1;
            if (o < 1) return;
            yield d.updateLineItem({
                quantity: o
            });
            const {
                speak: n
            } = yield
            import ("@surecart/a11y");
            n(i( /* translators: %d: quantity */
                __("Quantity decreased to %d.", "surecart"), o), "assertive")
        },
        onQuantityChange: function*(e) {
            const t = parseInt(e.target.value || "");
            yield* d.updateLineItem({
                quantity: t
            });
            const {
                speak: o
            } = yield
            import ("@surecart/a11y");
            o(i( /* translators: %d: quantity */
                __("Quantity changed to %d.", "surecart"), t), "assertive")
        },
        updateLineItem: function*(e) {
            l.loading = !0;
            const {
                line_item: t,
                mode: o,
                formId: n
            } = (0, r.getContext)(), {
                updateCheckoutLineItem: i
            } = yield
            import ("@surecart/checkout-service"), c = yield* i({
                id: t ? .id,
                data: e
            });
            d.setCheckout(c, o, n), l.loading = !1
        },
        removeLineItem: function*() {
            l.loading = !0;
            const {
                line_item: e,
                mode: t,
                formId: o
            } = (0, r.getContext)(), {
                speak: n
            } = yield
            import ("@surecart/a11y");
            n(__("Removing line item.", "surecart"), "assertive");
            const {
                removeCheckoutLineItem: i
            } = yield
            import ("@surecart/checkout-service"), c = yield* i(e ? .id);
            d.setCheckout(c, t, o), l.loading = !1
        },
        updateCheckout(e) {
            const {
                checkout: t,
                mode: o,
                formId: n
            } = e.detail;
            d.setCheckout(t, o, n)
        }
    }
});
addEventListener("scCheckoutUpdated", (e => {
    document.querySelector("sc-checkout") || d.updateCheckout(e)
}));