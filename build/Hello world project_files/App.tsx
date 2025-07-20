import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/client/App.tsx");if (!window.$RefreshReg$) throw new Error("React refresh preamble was not loaded. Something is wrong.");
const prevRefreshReg = window.$RefreshReg$;
const prevRefreshSig = window.$RefreshSig$;
window.$RefreshReg$ = RefreshRuntime.getRefreshReg("C:/Users/benbe/Downloads/Fun website builder repository/client/App.tsx");
window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;

import * as RefreshRuntime from "/@react-refresh";

import __vite__cjsImport1_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=a33c97c4"; const _jsxDEV = __vite__cjsImport1_react_jsxDevRuntime["jsxDEV"];
import "/client/global.css";
import { Toaster } from "/client/components/ui/toaster.tsx";
import __vite__cjsImport4_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=0ecb5d6e"; const createRoot = __vite__cjsImport4_reactDom_client["createRoot"];
import { Toaster as Sonner } from "/client/components/ui/sonner.tsx";
import { TooltipProvider } from "/client/components/ui/tooltip.tsx";
import { QueryClient, QueryClientProvider } from "/node_modules/.vite/deps/@tanstack_react-query.js?v=82b81b8f";
import { BrowserRouter, Routes, Route } from "/node_modules/.vite/deps/react-router-dom.js?v=2f50d128";
import Index from "/client/pages/Index.tsx";
import NotFound from "/client/pages/NotFound.tsx";
const queryClient = new QueryClient();
const App = ()=>/*#__PURE__*/ _jsxDEV(QueryClientProvider, {
        client: queryClient,
        children: /*#__PURE__*/ _jsxDEV(TooltipProvider, {
            children: [
                /*#__PURE__*/ _jsxDEV(Toaster, {}, void 0, false, {
                    fileName: "C:/Users/benbe/Downloads/Fun website builder repository/client/App.tsx",
                    lineNumber: 17,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ _jsxDEV(Sonner, {}, void 0, false, {
                    fileName: "C:/Users/benbe/Downloads/Fun website builder repository/client/App.tsx",
                    lineNumber: 18,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ _jsxDEV(BrowserRouter, {
                    children: /*#__PURE__*/ _jsxDEV(Routes, {
                        children: [
                            /*#__PURE__*/ _jsxDEV(Route, {
                                path: "/",
                                element: /*#__PURE__*/ _jsxDEV(Index, {}, void 0, false, {
                                    fileName: "C:/Users/benbe/Downloads/Fun website builder repository/client/App.tsx",
                                    lineNumber: 21,
                                    columnNumber: 36
                                }, void 0)
                            }, void 0, false, {
                                fileName: "C:/Users/benbe/Downloads/Fun website builder repository/client/App.tsx",
                                lineNumber: 21,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ _jsxDEV(Route, {
                                path: "*",
                                element: /*#__PURE__*/ _jsxDEV(NotFound, {}, void 0, false, {
                                    fileName: "C:/Users/benbe/Downloads/Fun website builder repository/client/App.tsx",
                                    lineNumber: 23,
                                    columnNumber: 36
                                }, void 0)
                            }, void 0, false, {
                                fileName: "C:/Users/benbe/Downloads/Fun website builder repository/client/App.tsx",
                                lineNumber: 23,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "C:/Users/benbe/Downloads/Fun website builder repository/client/App.tsx",
                        lineNumber: 20,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "C:/Users/benbe/Downloads/Fun website builder repository/client/App.tsx",
                    lineNumber: 19,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "C:/Users/benbe/Downloads/Fun website builder repository/client/App.tsx",
            lineNumber: 16,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "C:/Users/benbe/Downloads/Fun website builder repository/client/App.tsx",
        lineNumber: 15,
        columnNumber: 3
    }, this);
_c = App;
createRoot(document.getElementById("root")).render(/*#__PURE__*/ _jsxDEV(App, {}, void 0, false, {
    fileName: "C:/Users/benbe/Downloads/Fun website builder repository/client/App.tsx",
    lineNumber: 30,
    columnNumber: 53
}, this));
var _c;
$RefreshReg$(_c, "App");


window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
  RefreshRuntime.registerExportsForReactRefresh("C:/Users/benbe/Downloads/Fun website builder repository/client/App.tsx", currentExports);
  import.meta.hot.accept((nextExports) => {
    if (!nextExports) return;
    const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/benbe/Downloads/Fun website builder repository/client/App.tsx", currentExports, nextExports);
    if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
  });
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwiLi9nbG9iYWwuY3NzXCI7XG5cbmltcG9ydCB7IFRvYXN0ZXIgfSBmcm9tIFwiQC9jb21wb25lbnRzL3VpL3RvYXN0ZXJcIjtcbmltcG9ydCB7IGNyZWF0ZVJvb3QgfSBmcm9tIFwicmVhY3QtZG9tL2NsaWVudFwiO1xuaW1wb3J0IHsgVG9hc3RlciBhcyBTb25uZXIgfSBmcm9tIFwiQC9jb21wb25lbnRzL3VpL3Nvbm5lclwiO1xuaW1wb3J0IHsgVG9vbHRpcFByb3ZpZGVyIH0gZnJvbSBcIkAvY29tcG9uZW50cy91aS90b29sdGlwXCI7XG5pbXBvcnQgeyBRdWVyeUNsaWVudCwgUXVlcnlDbGllbnRQcm92aWRlciB9IGZyb20gXCJAdGFuc3RhY2svcmVhY3QtcXVlcnlcIjtcbmltcG9ydCB7IEJyb3dzZXJSb3V0ZXIsIFJvdXRlcywgUm91dGUgfSBmcm9tIFwicmVhY3Qtcm91dGVyLWRvbVwiO1xuaW1wb3J0IEluZGV4IGZyb20gXCIuL3BhZ2VzL0luZGV4XCI7XG5pbXBvcnQgTm90Rm91bmQgZnJvbSBcIi4vcGFnZXMvTm90Rm91bmRcIjtcblxuY29uc3QgcXVlcnlDbGllbnQgPSBuZXcgUXVlcnlDbGllbnQoKTtcblxuY29uc3QgQXBwID0gKCkgPT4gKFxuICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e3F1ZXJ5Q2xpZW50fT5cbiAgICA8VG9vbHRpcFByb3ZpZGVyPlxuICAgICAgPFRvYXN0ZXIgLz5cbiAgICAgIDxTb25uZXIgLz5cbiAgICAgIDxCcm93c2VyUm91dGVyPlxuICAgICAgICA8Um91dGVzPlxuICAgICAgICAgIDxSb3V0ZSBwYXRoPVwiL1wiIGVsZW1lbnQ9ezxJbmRleCAvPn0gLz5cbiAgICAgICAgICB7LyogQUREIEFMTCBDVVNUT00gUk9VVEVTIEFCT1ZFIFRIRSBDQVRDSC1BTEwgXCIqXCIgUk9VVEUgKi99XG4gICAgICAgICAgPFJvdXRlIHBhdGg9XCIqXCIgZWxlbWVudD17PE5vdEZvdW5kIC8+fSAvPlxuICAgICAgICA8L1JvdXRlcz5cbiAgICAgIDwvQnJvd3NlclJvdXRlcj5cbiAgICA8L1Rvb2x0aXBQcm92aWRlcj5cbiAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPlxuKTtcblxuY3JlYXRlUm9vdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIikhKS5yZW5kZXIoPEFwcCAvPik7XG4iXSwibmFtZXMiOlsiVG9hc3RlciIsImNyZWF0ZVJvb3QiLCJTb25uZXIiLCJUb29sdGlwUHJvdmlkZXIiLCJRdWVyeUNsaWVudCIsIlF1ZXJ5Q2xpZW50UHJvdmlkZXIiLCJCcm93c2VyUm91dGVyIiwiUm91dGVzIiwiUm91dGUiLCJJbmRleCIsIk5vdEZvdW5kIiwicXVlcnlDbGllbnQiLCJBcHAiLCJjbGllbnQiLCJwYXRoIiwiZWxlbWVudCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW5kZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLE9BQU8sZUFBZTtBQUV0QixTQUFTQSxPQUFPLFFBQVEsMEJBQTBCO0FBQ2xELFNBQVNDLFVBQVUsUUFBUSxtQkFBbUI7QUFDOUMsU0FBU0QsV0FBV0UsTUFBTSxRQUFRLHlCQUF5QjtBQUMzRCxTQUFTQyxlQUFlLFFBQVEsMEJBQTBCO0FBQzFELFNBQVNDLFdBQVcsRUFBRUMsbUJBQW1CLFFBQVEsd0JBQXdCO0FBQ3pFLFNBQVNDLGFBQWEsRUFBRUMsTUFBTSxFQUFFQyxLQUFLLFFBQVEsbUJBQW1CO0FBQ2hFLE9BQU9DLFdBQVcsZ0JBQWdCO0FBQ2xDLE9BQU9DLGNBQWMsbUJBQW1CO0FBRXhDLE1BQU1DLGNBQWMsSUFBSVA7QUFFeEIsTUFBTVEsTUFBTSxrQkFDVixRQUFDUDtRQUFvQlEsUUFBUUY7a0JBQzNCLGNBQUEsUUFBQ1I7OzhCQUNDLFFBQUNIOzs7Ozs4QkFDRCxRQUFDRTs7Ozs7OEJBQ0QsUUFBQ0k7OEJBQ0MsY0FBQSxRQUFDQzs7MENBQ0MsUUFBQ0M7Z0NBQU1NLE1BQUs7Z0NBQUlDLHVCQUFTLFFBQUNOOzs7Ozs7Ozs7OzBDQUUxQixRQUFDRDtnQ0FBTU0sTUFBSztnQ0FBSUMsdUJBQVMsUUFBQ0w7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBVDlCRTtBQWdCTlgsV0FBV2UsU0FBU0MsY0FBYyxDQUFDLFNBQVVDLE1BQU0sZUFBQyxRQUFDTiJ9