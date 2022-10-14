"use strict";
import tlswasm from "./tls.wasm";
// build/postgres-tmp.js
var tls_emscripten = (() => {
  var _scriptDir = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : void 0;
  return function(tls_emscripten2) {
    tls_emscripten2 = tls_emscripten2 || {};
    var Module = typeof tls_emscripten2 != "undefined" ? tls_emscripten2 : {};
    var readyPromiseResolve, readyPromiseReject;
    Module["ready"] = new Promise(function(resolve3, reject) {
      readyPromiseResolve = resolve3;
      readyPromiseReject = reject;
    });
    var moduleOverrides = Object.assign({}, Module);
    var arguments_ = [];
    var thisProgram = "./this.program";
    var quit_ = (status, toThrow) => {
      throw toThrow;
    };
    var ENVIRONMENT_IS_WEB = true;
    var ENVIRONMENT_IS_WORKER = false;
    var scriptDirectory = "";
    function locateFile(path2) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path2, scriptDirectory);
      }
      return scriptDirectory + path2;
    }
    var read_, readAsync, readBinary, setWindowTitle;
    if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href;
      } else if (typeof document != "undefined" && document.currentScript) {
        scriptDirectory = document.currentScript.src;
      }
      if (_scriptDir) {
        scriptDirectory = _scriptDir;
      }
      if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
      } else {
        scriptDirectory = "";
      }
      {
        read_ = (url) => {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          xhr.send(null);
          return xhr.responseText;
        };
        if (ENVIRONMENT_IS_WORKER) {
          readBinary = (url) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.responseType = "arraybuffer";
            xhr.send(null);
            return new Uint8Array(xhr.response);
          };
        }
        readAsync = (url, onload, onerror) => {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = "arraybuffer";
          xhr.onload = () => {
            if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
              onload(xhr.response);
              return;
            }
            onerror();
          };
          xhr.onerror = onerror;
          xhr.send(null);
        };
      }
      setWindowTitle = (title) => document.title = title;
    } else {
    }
    var out = Module["print"] || console.log.bind(console);
    var err = Module["printErr"] || console.warn.bind(console);
    Object.assign(Module, moduleOverrides);
    moduleOverrides = null;
    if (Module["arguments"])
      arguments_ = Module["arguments"];
    if (Module["thisProgram"])
      thisProgram = Module["thisProgram"];
    if (Module["quit"])
      quit_ = Module["quit"];
    var wasmBinary;
    if (Module["wasmBinary"])
      wasmBinary = Module["wasmBinary"];
    var noExitRuntime = Module["noExitRuntime"] || true;
    if (typeof WebAssembly != "object") {
      abort("no native wasm support detected");
    }
    var wasmMemory;
    var ABORT = false;
    var EXITSTATUS;
    function assert2(condition, text) {
      if (!condition) {
        abort(text);
      }
    }
    var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : void 0;
    function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      while (heapOrArray[endPtr] && !(endPtr >= endIdx))
        ++endPtr;
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = "";
      while (idx < endPtr) {
        var u0 = heapOrArray[idx++];
        if (!(u0 & 128)) {
          str += String.fromCharCode(u0);
          continue;
        }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 224) == 192) {
          str += String.fromCharCode((u0 & 31) << 6 | u1);
          continue;
        }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 240) == 224) {
          u0 = (u0 & 15) << 12 | u1 << 6 | u2;
        } else {
          u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
        }
        if (u0 < 65536) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 65536;
          str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
        }
      }
      return str;
    }
    function UTF8ToString(ptr, maxBytesToRead) {
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
    }
    function stringToUTF8Array(str, heap2, outIdx, maxBytesToWrite) {
      if (!(maxBytesToWrite > 0))
        return 0;
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
          var u1 = str.charCodeAt(++i);
          u = 65536 + ((u & 1023) << 10) | u1 & 1023;
        }
        if (u <= 127) {
          if (outIdx >= endIdx)
            break;
          heap2[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx)
            break;
          heap2[outIdx++] = 192 | u >> 6;
          heap2[outIdx++] = 128 | u & 63;
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx)
            break;
          heap2[outIdx++] = 224 | u >> 12;
          heap2[outIdx++] = 128 | u >> 6 & 63;
          heap2[outIdx++] = 128 | u & 63;
        } else {
          if (outIdx + 3 >= endIdx)
            break;
          heap2[outIdx++] = 240 | u >> 18;
          heap2[outIdx++] = 128 | u >> 12 & 63;
          heap2[outIdx++] = 128 | u >> 6 & 63;
          heap2[outIdx++] = 128 | u & 63;
        }
      }
      heap2[outIdx] = 0;
      return outIdx - startIdx;
    }
    function stringToUTF8(str, outPtr, maxBytesToWrite) {
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    }
    function lengthBytesUTF8(str) {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var c = str.charCodeAt(i);
        if (c <= 127) {
          len++;
        } else if (c <= 2047) {
          len += 2;
        } else if (c >= 55296 && c <= 57343) {
          len += 4;
          ++i;
        } else {
          len += 3;
        }
      }
      return len;
    }
    var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
    function updateGlobalBufferAndViews(buf) {
      buffer = buf;
      Module["HEAP8"] = HEAP8 = new Int8Array(buf);
      Module["HEAP16"] = HEAP16 = new Int16Array(buf);
      Module["HEAP32"] = HEAP32 = new Int32Array(buf);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
      Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
      Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
    }
    var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
    var wasmTable;
    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATPOSTRUN__ = [];
    var runtimeInitialized = false;
    function preRun() {
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function")
          Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPRERUN__);
    }
    function initRuntime() {
      runtimeInitialized = true;
      callRuntimeCallbacks(__ATINIT__);
    }
    function postRun() {
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function")
          Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPOSTRUN__);
    }
    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb);
    }
    function addOnInit(cb) {
      __ATINIT__.unshift(cb);
    }
    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }
    var runDependencies = 0;
    var runDependencyWatcher = null;
    var dependenciesFulfilled = null;
    function addRunDependency(id) {
      runDependencies++;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
    }
    function removeRunDependency(id) {
      runDependencies--;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }
    function abort(what) {
      {
        if (Module["onAbort"]) {
          Module["onAbort"](what);
        }
      }
      what = "Aborted(" + what + ")";
      err(what);
      ABORT = true;
      EXITSTATUS = 1;
      what += ". Build with -sASSERTIONS for more info.";
      var e = new WebAssembly.RuntimeError(what);
      readyPromiseReject(e);
      throw e;
    }
    var dataURIPrefix = "data:application/octet-stream;base64,";
    function isDataURI(filename) {
      return filename.startsWith(dataURIPrefix);
    }
    var wasmBinaryFile;
    wasmBinaryFile = "tls.wasm";
    if (!isDataURI(wasmBinaryFile)) {
      wasmBinaryFile = locateFile(wasmBinaryFile);
    }
    function getBinary(file) {
      try {
        if (file == wasmBinaryFile && wasmBinary) {
          return new Uint8Array(wasmBinary);
        }
        if (readBinary) {
          return readBinary(file);
        }
        throw "both async and sync fetching of the wasm failed";
      } catch (err2) {
        abort(err2);
      }
    }
    function getBinaryPromise() {
      if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
        if (typeof fetch == "function") {
          return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
            if (!response["ok"]) {
              throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
            }
            return response["arrayBuffer"]();
          }).catch(function() {
            return getBinary(wasmBinaryFile);
          });
        }
      }
      return Promise.resolve().then(function() {
        return getBinary(wasmBinaryFile);
      });
    }
    function createWasm() {
      var info = { "a": asmLibraryArg };
      function receiveInstance(instance, module) {
        var exports2 = instance.exports;
        exports2 = Asyncify.instrumentWasmExports(exports2);
        Module["asm"] = exports2;
        wasmMemory = Module["asm"]["k"];
        updateGlobalBufferAndViews(wasmMemory.buffer);
        wasmTable = Module["asm"]["p"];
        addOnInit(Module["asm"]["l"]);
        removeRunDependency("wasm-instantiate");
      }
      addRunDependency("wasm-instantiate");
      function receiveInstantiationResult(result) {
        receiveInstance(result["instance"]);
      }
      function instantiateArrayBuffer(receiver) {
        return getBinaryPromise().then(function(binary) {
          return WebAssembly.instantiate(binary, info);
        }).then(function(instance) {
          return instance;
        }).then(receiver, function(reason) {
          err("failed to asynchronously prepare wasm: " + reason);
          abort(reason);
        });
      }
      function instantiateAsync() {
        if (!wasmBinary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(wasmBinaryFile) && typeof fetch == "function") {
          return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
            var result = WebAssembly.instantiateStreaming(response, info);
            return result.then(receiveInstantiationResult, function(reason) {
              err("wasm streaming compile failed: " + reason);
              err("falling back to ArrayBuffer instantiation");
              return instantiateArrayBuffer(receiveInstantiationResult);
            });
          });
        } else {
          return instantiateArrayBuffer(receiveInstantiationResult);
        }
      }
      if (Module["instantiateWasm"]) {
        try {
          var exports = Module["instantiateWasm"](info, receiveInstance);
          exports = Asyncify.instrumentWasmExports(exports);
          return exports;
        } catch (e) {
          err("Module.instantiateWasm callback failed with error: " + e);
          readyPromiseReject(e);
        }
      }
      instantiateAsync().catch(readyPromiseReject);
      return {};
    }
    function __asyncjs__jsProvideEncryptedFromNetwork(buff, sz) {
      return Asyncify.handleAsync(async () => {
        const bytesRead = await Module.provideEncryptedFromNetwork(buff, sz);
        return bytesRead;
      });
    }
    function jsWriteEncryptedToNetwork(buff, sz) {
      const bytesWritten = Module.writeEncryptedToNetwork(buff, sz);
      return bytesWritten;
    }
    function wc_GenerateSeed(os, output, sz) {
      const entropy = new Uint8Array(sz);
      crypto.getRandomValues(entropy);
      Module.HEAPU8.set(entropy, output);
      return 0;
    }
    function ExitStatus(status) {
      this.name = "ExitStatus";
      this.message = "Program terminated with exit(" + status + ")";
      this.status = status;
    }
    function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        callbacks.shift()(Module);
      }
    }
    function handleException(e) {
      if (e instanceof ExitStatus || e == "unwind") {
        return EXITSTATUS;
      }
      quit_(1, e);
    }
    function writeArrayToMemory(array, buffer2) {
      HEAP8.set(array, buffer2);
    }
    function readI53FromI64(ptr) {
      return HEAPU32[ptr >> 2] + HEAP32[ptr + 4 >> 2] * 4294967296;
    }
    function __gmtime_js(time, tmPtr) {
      var date = new Date(readI53FromI64(time) * 1e3);
      HEAP32[tmPtr >> 2] = date.getUTCSeconds();
      HEAP32[tmPtr + 4 >> 2] = date.getUTCMinutes();
      HEAP32[tmPtr + 8 >> 2] = date.getUTCHours();
      HEAP32[tmPtr + 12 >> 2] = date.getUTCDate();
      HEAP32[tmPtr + 16 >> 2] = date.getUTCMonth();
      HEAP32[tmPtr + 20 >> 2] = date.getUTCFullYear() - 1900;
      HEAP32[tmPtr + 24 >> 2] = date.getUTCDay();
      var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
      var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
      HEAP32[tmPtr + 28 >> 2] = yday;
    }
    function allocateUTF8(str) {
      var size = lengthBytesUTF8(str) + 1;
      var ret = _malloc(size);
      if (ret)
        stringToUTF8Array(str, HEAP8, ret, size);
      return ret;
    }
    function _tzset_impl(timezone, daylight, tzname) {
      var currentYear = new Date().getFullYear();
      var winter = new Date(currentYear, 0, 1);
      var summer = new Date(currentYear, 6, 1);
      var winterOffset = winter.getTimezoneOffset();
      var summerOffset = summer.getTimezoneOffset();
      var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
      HEAP32[timezone >> 2] = stdTimezoneOffset * 60;
      HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
      function extractZone(date) {
        var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
        return match ? match[1] : "GMT";
      }
      var winterName = extractZone(winter);
      var summerName = extractZone(summer);
      var winterNamePtr = allocateUTF8(winterName);
      var summerNamePtr = allocateUTF8(summerName);
      if (summerOffset < winterOffset) {
        HEAPU32[tzname >> 2] = winterNamePtr;
        HEAPU32[tzname + 4 >> 2] = summerNamePtr;
      } else {
        HEAPU32[tzname >> 2] = summerNamePtr;
        HEAPU32[tzname + 4 >> 2] = winterNamePtr;
      }
    }
    function __tzset_js(timezone, daylight, tzname) {
      if (__tzset_js.called)
        return;
      __tzset_js.called = true;
      _tzset_impl(timezone, daylight, tzname);
    }
    function _emscripten_date_now() {
      return Date.now();
    }
    function getHeapMax() {
      return 2147483648;
    }
    function emscripten_realloc_buffer(size) {
      try {
        wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1;
      } catch (e) {
      }
    }
    function _emscripten_resize_heap(requestedSize) {
      var oldSize = HEAPU8.length;
      requestedSize = requestedSize >>> 0;
      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        return false;
      }
      let alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
        var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
        var replacement = emscripten_realloc_buffer(newSize);
        if (replacement) {
          return true;
        }
      }
      return false;
    }
    var SYSCALLS = { varargs: void 0, get: function() {
      SYSCALLS.varargs += 4;
      var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
      return ret;
    }, getStr: function(ptr) {
      var ret = UTF8ToString(ptr);
      return ret;
    } };
    function _fd_close(fd) {
      return 52;
    }
    function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
      return 70;
    }
    var printCharBuffers = [null, [], []];
    function printChar(stream, curr) {
      var buffer2 = printCharBuffers[stream];
      if (curr === 0 || curr === 10) {
        (stream === 1 ? out : err)(UTF8ArrayToString(buffer2, 0));
        buffer2.length = 0;
      } else {
        buffer2.push(curr);
      }
    }
    function _fd_write(fd, iov, iovcnt, pnum) {
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >> 2];
        var len = HEAPU32[iov + 4 >> 2];
        iov += 8;
        for (var j = 0; j < len; j++) {
          printChar(fd, HEAPU8[ptr + j]);
        }
        num += len;
      }
      HEAPU32[pnum >> 2] = num;
      return 0;
    }
    function runAndAbortIfError(func) {
      try {
        return func();
      } catch (e) {
        abort(e);
      }
    }
    function callUserCallback(func) {
      if (ABORT) {
        return;
      }
      try {
        func();
      } catch (e) {
        handleException(e);
      }
    }
    function runtimeKeepalivePush() {
    }
    function runtimeKeepalivePop() {
    }
    var Asyncify = { State: { Normal: 0, Unwinding: 1, Rewinding: 2, Disabled: 3 }, state: 0, StackSize: 4096, currData: null, handleSleepReturnValue: 0, exportCallStack: [], callStackNameToId: {}, callStackIdToName: {}, callStackId: 0, asyncPromiseHandlers: null, sleepCallbacks: [], getCallStackId: function(funcName) {
      var id = Asyncify.callStackNameToId[funcName];
      if (id === void 0) {
        id = Asyncify.callStackId++;
        Asyncify.callStackNameToId[funcName] = id;
        Asyncify.callStackIdToName[id] = funcName;
      }
      return id;
    }, instrumentWasmImports: function(imports2) {
      var ASYNCIFY_IMPORTS = ["env.invoke_*", "env.emscripten_sleep", "env.emscripten_wget", "env.emscripten_wget_data", "env.emscripten_idb_load", "env.emscripten_idb_store", "env.emscripten_idb_delete", "env.emscripten_idb_exists", "env.emscripten_idb_load_blob", "env.emscripten_idb_store_blob", "env.SDL_Delay", "env.emscripten_scan_registers", "env.emscripten_lazy_load_code", "env.emscripten_fiber_swap", "wasi_snapshot_preview1.fd_sync", "env.__wasi_fd_sync", "env._emval_await", "env._dlopen_js", "env.__asyncjs__*"].map((x2) => x2.split(".")[1]);
      for (var x in imports2) {
        (function(x2) {
          var original = imports2[x2];
          var sig = original.sig;
          if (typeof original == "function") {
            var isAsyncifyImport = ASYNCIFY_IMPORTS.indexOf(x2) >= 0 || x2.startsWith("__asyncjs__");
          }
        })(x);
      }
    }, instrumentWasmExports: function(exports) {
      var ret = {};
      for (var x in exports) {
        (function(x2) {
          var original = exports[x2];
          if (typeof original == "function") {
            ret[x2] = function() {
              Asyncify.exportCallStack.push(x2);
              try {
                return original.apply(null, arguments);
              } finally {
                if (!ABORT) {
                  var y = Asyncify.exportCallStack.pop();
                  assert2(y === x2);
                  Asyncify.maybeStopUnwind();
                }
              }
            };
          } else {
            ret[x2] = original;
          }
        })(x);
      }
      return ret;
    }, maybeStopUnwind: function() {
      if (Asyncify.currData && Asyncify.state === Asyncify.State.Unwinding && Asyncify.exportCallStack.length === 0) {
        Asyncify.state = Asyncify.State.Normal;
        runAndAbortIfError(_asyncify_stop_unwind);
        if (typeof Fibers != "undefined") {
          Fibers.trampoline();
        }
      }
    }, whenDone: function() {
      return new Promise((resolve3, reject) => {
        Asyncify.asyncPromiseHandlers = { resolve: resolve3, reject };
      });
    }, allocateData: function() {
      var ptr = _malloc(12 + Asyncify.StackSize);
      Asyncify.setDataHeader(ptr, ptr + 12, Asyncify.StackSize);
      Asyncify.setDataRewindFunc(ptr);
      return ptr;
    }, setDataHeader: function(ptr, stack, stackSize) {
      HEAP32[ptr >> 2] = stack;
      HEAP32[ptr + 4 >> 2] = stack + stackSize;
    }, setDataRewindFunc: function(ptr) {
      var bottomOfCallStack = Asyncify.exportCallStack[0];
      var rewindId = Asyncify.getCallStackId(bottomOfCallStack);
      HEAP32[ptr + 8 >> 2] = rewindId;
    }, getDataRewindFunc: function(ptr) {
      var id = HEAP32[ptr + 8 >> 2];
      var name = Asyncify.callStackIdToName[id];
      var func = Module["asm"][name];
      return func;
    }, doRewind: function(ptr) {
      var start = Asyncify.getDataRewindFunc(ptr);
      return start();
    }, handleSleep: function(startAsync) {
      if (ABORT)
        return;
      if (Asyncify.state === Asyncify.State.Normal) {
        var reachedCallback = false;
        var reachedAfterCallback = false;
        startAsync((handleSleepReturnValue) => {
          if (ABORT)
            return;
          Asyncify.handleSleepReturnValue = handleSleepReturnValue || 0;
          reachedCallback = true;
          if (!reachedAfterCallback) {
            return;
          }
          Asyncify.state = Asyncify.State.Rewinding;
          runAndAbortIfError(() => _asyncify_start_rewind(Asyncify.currData));
          if (typeof Browser != "undefined" && Browser.mainLoop.func) {
            Browser.mainLoop.resume();
          }
          var asyncWasmReturnValue, isError = false;
          try {
            asyncWasmReturnValue = Asyncify.doRewind(Asyncify.currData);
          } catch (err2) {
            asyncWasmReturnValue = err2;
            isError = true;
          }
          var handled = false;
          if (!Asyncify.currData) {
            var asyncPromiseHandlers = Asyncify.asyncPromiseHandlers;
            if (asyncPromiseHandlers) {
              Asyncify.asyncPromiseHandlers = null;
              (isError ? asyncPromiseHandlers.reject : asyncPromiseHandlers.resolve)(asyncWasmReturnValue);
              handled = true;
            }
          }
          if (isError && !handled) {
            throw asyncWasmReturnValue;
          }
        });
        reachedAfterCallback = true;
        if (!reachedCallback) {
          Asyncify.state = Asyncify.State.Unwinding;
          Asyncify.currData = Asyncify.allocateData();
          if (typeof Browser != "undefined" && Browser.mainLoop.func) {
            Browser.mainLoop.pause();
          }
          runAndAbortIfError(() => _asyncify_start_unwind(Asyncify.currData));
        }
      } else if (Asyncify.state === Asyncify.State.Rewinding) {
        Asyncify.state = Asyncify.State.Normal;
        runAndAbortIfError(_asyncify_stop_rewind);
        _free(Asyncify.currData);
        Asyncify.currData = null;
        Asyncify.sleepCallbacks.forEach((func) => callUserCallback(func));
      } else {
        abort("invalid state: " + Asyncify.state);
      }
      return Asyncify.handleSleepReturnValue;
    }, handleAsync: function(startAsync) {
      return Asyncify.handleSleep((wakeUp) => {
        startAsync().then(wakeUp);
      });
    } };
    function getCFunc(ident) {
      var func = Module["_" + ident];
      return func;
    }
    function ccall(ident, returnType, argTypes, args, opts) {
      var toC = { "string": (str) => {
        var ret2 = 0;
        if (str !== null && str !== void 0 && str !== 0) {
          var len = (str.length << 2) + 1;
          ret2 = stackAlloc(len);
          stringToUTF8(str, ret2, len);
        }
        return ret2;
      }, "array": (arr) => {
        var ret2 = stackAlloc(arr.length);
        writeArrayToMemory(arr, ret2);
        return ret2;
      } };
      function convertReturnValue(ret2) {
        if (returnType === "string") {
          return UTF8ToString(ret2);
        }
        if (returnType === "boolean")
          return Boolean(ret2);
        return ret2;
      }
      var func = getCFunc(ident);
      var cArgs = [];
      var stack = 0;
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]];
          if (converter) {
            if (stack === 0)
              stack = stackSave();
            cArgs[i] = converter(args[i]);
          } else {
            cArgs[i] = args[i];
          }
        }
      }
      var previousAsync = Asyncify.currData;
      var ret = func.apply(null, cArgs);
      function onDone(ret2) {
        runtimeKeepalivePop();
        if (stack !== 0)
          stackRestore(stack);
        return convertReturnValue(ret2);
      }
      runtimeKeepalivePush();
      var asyncMode = opts && opts.async;
      if (Asyncify.currData != previousAsync) {
        return Asyncify.whenDone().then(onDone);
      }
      ret = onDone(ret);
      if (asyncMode)
        return Promise.resolve(ret);
      return ret;
    }
    function cwrap(ident, returnType, argTypes, opts) {
      argTypes = argTypes || [];
      var numericArgs = argTypes.every((type) => type === "number" || type === "boolean");
      var numericRet = returnType !== "string";
      if (numericRet && numericArgs && !opts) {
        return getCFunc(ident);
      }
      return function() {
        return ccall(ident, returnType, argTypes, arguments, opts);
      };
    }
    var asmLibraryArg = { "j": __asyncjs__jsProvideEncryptedFromNetwork, "g": __gmtime_js, "h": __tzset_js, "f": _emscripten_date_now, "c": _emscripten_resize_heap, "e": _fd_close, "b": _fd_seek, "d": _fd_write, "i": jsWriteEncryptedToNetwork, "a": wc_GenerateSeed };
    var asm = createWasm();
    var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
      return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["l"]).apply(null, arguments);
    };
    var _initTls = Module["_initTls"] = function() {
      return (_initTls = Module["_initTls"] = Module["asm"]["m"]).apply(null, arguments);
    };
    var _readData = Module["_readData"] = function() {
      return (_readData = Module["_readData"] = Module["asm"]["n"]).apply(null, arguments);
    };
    var _writeData = Module["_writeData"] = function() {
      return (_writeData = Module["_writeData"] = Module["asm"]["o"]).apply(null, arguments);
    };
    var _malloc = Module["_malloc"] = function() {
      return (_malloc = Module["_malloc"] = Module["asm"]["q"]).apply(null, arguments);
    };
    var _free = Module["_free"] = function() {
      return (_free = Module["_free"] = Module["asm"]["r"]).apply(null, arguments);
    };
    var stackSave = Module["stackSave"] = function() {
      return (stackSave = Module["stackSave"] = Module["asm"]["s"]).apply(null, arguments);
    };
    var stackRestore = Module["stackRestore"] = function() {
      return (stackRestore = Module["stackRestore"] = Module["asm"]["t"]).apply(null, arguments);
    };
    var stackAlloc = Module["stackAlloc"] = function() {
      return (stackAlloc = Module["stackAlloc"] = Module["asm"]["u"]).apply(null, arguments);
    };
    var _asyncify_start_unwind = Module["_asyncify_start_unwind"] = function() {
      return (_asyncify_start_unwind = Module["_asyncify_start_unwind"] = Module["asm"]["v"]).apply(null, arguments);
    };
    var _asyncify_stop_unwind = Module["_asyncify_stop_unwind"] = function() {
      return (_asyncify_stop_unwind = Module["_asyncify_stop_unwind"] = Module["asm"]["w"]).apply(null, arguments);
    };
    var _asyncify_start_rewind = Module["_asyncify_start_rewind"] = function() {
      return (_asyncify_start_rewind = Module["_asyncify_start_rewind"] = Module["asm"]["x"]).apply(null, arguments);
    };
    var _asyncify_stop_rewind = Module["_asyncify_stop_rewind"] = function() {
      return (_asyncify_stop_rewind = Module["_asyncify_stop_rewind"] = Module["asm"]["y"]).apply(null, arguments);
    };
    var ___start_em_js = Module["___start_em_js"] = 19040;
    var ___stop_em_js = Module["___stop_em_js"] = 19551;
    Module["ccall"] = ccall;
    Module["cwrap"] = cwrap;
    var calledRun;
    dependenciesFulfilled = function runCaller() {
      if (!calledRun)
        run2();
      if (!calledRun)
        dependenciesFulfilled = runCaller;
    };
    function run2(args) {
      args = args || arguments_;
      if (runDependencies > 0) {
        return;
      }
      preRun();
      if (runDependencies > 0) {
        return;
      }
      function doRun() {
        if (calledRun)
          return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT)
          return;
        initRuntime();
        readyPromiseResolve(Module);
        if (Module["onRuntimeInitialized"])
          Module["onRuntimeInitialized"]();
        postRun();
      }
      if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function() {
          setTimeout(function() {
            Module["setStatus"]("");
          }, 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
    }
    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function")
        Module["preInit"] = [Module["preInit"]];
      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()();
      }
    }
    run2();
    return tls_emscripten2.ready;
  };
})();
var wstls_default = async function(host, port, wsProxy, verbose = false) {
  let tlsStarted = false;
  const incomingDataQueue = [];
  let outstandingDataRequest = null;
  function dequeueIncomingData() {
    if (verbose)
      console.log("dequeue ...");
    if (incomingDataQueue.length === 0) {
      if (verbose)
        console.log("no data available");
      return;
    }
    if (outstandingDataRequest === null) {
      if (verbose)
        console.log("data available but not awaited");
      return;
    }
    let nextData = incomingDataQueue[0];
    const { container, maxBytes, resolve: resolve3 } = outstandingDataRequest;
    if (nextData.length > maxBytes) {
      if (verbose)
        console.log("splitting next chunk");
      incomingDataQueue[0] = nextData.subarray(maxBytes);
      nextData = nextData.subarray(0, maxBytes);
    } else {
      if (verbose)
        console.log("returning next chunk whole");
      incomingDataQueue.shift();
    }
    if (tlsStarted) {
      if (verbose)
        console.log("providing data to wasm for decryption");
      module.HEAPU8.set(nextData, container);
    } else {
      if (verbose)
        console.log("providing data direct");
      container.set(nextData);
    }
    outstandingDataRequest = null;
    const len = nextData.length;
    if (verbose)
      console.log(`${len} bytes dequeued`);
    resolve3(len);
  }
  const wsAddr = `${wsProxy}?name=${host}:${port}`;
  const [resp, module] = await Promise.all([
    fetch(wsAddr, { headers: { Upgrade: "websocket" } }),
    tls_emscripten({
      instantiateWasm(info, receive) {
        if (verbose)
          console.log("loading wasm");
        let instance = new WebAssembly.Instance(tlswasm, info);
        receive(instance);
        return instance.exports;
      },
      provideEncryptedFromNetwork(buf, maxBytes) {
        if (verbose)
          console.log(`provideEncryptedFromNetwork: providing up to ${maxBytes} bytes`);
        return new Promise((resolve3) => {
          outstandingDataRequest = { container: buf, maxBytes, resolve: resolve3 };
          dequeueIncomingData();
        });
      },
      writeEncryptedToNetwork(buf, size) {
        if (verbose)
          console.log(`writeEncryptedToNetwork: writing ${size} bytes`);
        const arr = module.HEAPU8.slice(buf, buf + size);
        socket.send(arr);
        return size;
      }
    })
  ]);
  const socket = resp.webSocket;
  socket.accept();
  socket.binaryType = "arraybuffer";
  socket.addEventListener("error", (err) => {
    throw err;
  });
  socket.addEventListener("close", () => {
    if (verbose)
      console.log("socket: disconnected");
    if (outstandingDataRequest) {
      outstandingDataRequest.resolve(0);
      outstandingDataRequest = null;
    }
  });
  socket.addEventListener("message", (msg) => {
    const data2 = new Uint8Array(msg.data);
    if (verbose)
      console.log(`socket: ${data2.length} bytes received`);
    incomingDataQueue.push(data2);
    dequeueIncomingData();
  });
  const tls = {
    initTls: module.cwrap("initTls", "number", ["string", "array", "number"]),
    writeData: module.cwrap("writeData", "number", ["array", "number"], { async: true }),
    readData: module.cwrap("readData", "number", ["number", "number"], { async: true })
  };
  return {
    startTls() {
      if (verbose)
        console.log("initialising TLS");
      tlsStarted = true;
      const entropyLen = 128;
      const entropy = new Uint8Array(entropyLen);
      crypto.getRandomValues(entropy);
      return tls.initTls(host, entropy, entropyLen);
    },
    async writeData(data2) {
      if (tlsStarted) {
        if (verbose)
          console.log("TLS writeData");
        const status = await tls.writeData(data2, data2.length);
        return status;
      } else {
        if (verbose)
          console.log("raw writeData");
        socket.send(data2);
        return 0;
      }
    },
    async readData(data2) {
      const maxBytes = data2.length;
      if (tlsStarted) {
        if (verbose)
          console.log("TLS readData");
        const buf = module._malloc(maxBytes);
        const bytesRead = await tls.readData(buf, maxBytes);
        data2.set(module.HEAPU8.subarray(buf, buf + bytesRead));
        module._free(buf);
        return bytesRead;
      } else {
        if (verbose)
          console.log("raw readData");
        return new Promise((resolve3) => {
          outstandingDataRequest = { container: data2, maxBytes, resolve: resolve3 };
          dequeueIncomingData();
        });
      }
    },
    close() {
      if (verbose)
        console.log("requested close");
      socket.close();
    }
  };
};
var TcpOverWebsocketConn = class {
  localAddr = { transport: "tcp", hostname: "localhost", port: 5432 };
  remoteAddr = { transport: "tcp", hostname: "172.17.0.2", port: 5432 };
  rid = 1;
  ws;
  constructor(ws) {
    this.ws = ws;
  }
  closeWrite() {
    throw new Error("Method not implemented.");
  }
  async read(p) {
    const bytesRead = await this.ws.readData(p);
    return bytesRead;
  }
  async write(p) {
    await this.ws.writeData(p);
    return p.length;
  }
  close() {
    this.ws.close();
  }
};
var workerDenoPostgres_startTls = function(connection) {
  connection.ws.startTls();
  return Promise.resolve(connection);
};
var workerDenoPostgres_connect = async function(options) {
  if (options.hostname === void 0) {
    throw new Error("Tunnel hostname undefined");
  }
  const wsProxy = "http://proxy.hahathon.monster/";
  const wsTls = await wstls_default(options.hostname, options.port, wsProxy, false);
  return new TcpOverWebsocketConn(wsTls);
};
var warnOrThrowIncompatible = (id, args = [], extraInfo) => {
  if (false) {
    let printedArgs = [];
    if (typeof args[0] === "string" && args[0].length < 100) {
      printedArgs.push(`"${args[0]}"`);
    } else {
      printedArgs.push("...");
    }
    if (args.length > 1) {
      printedArgs.push("...");
    }
    const printedArgsStr = printedArgs.join(", ");
    const warningOrError = `Called \`${id}(${printedArgsStr})\`, ${extraInfo ? `${extraInfo}, ` : ""}but this is not available in Workers`;
    if (false) {
      console.warn(warningOrError);
    } else {
      throw new Error(warningOrError);
    }
  }
};
var workerDeno_build = {
  os: "linux",
  arch: "aarch64"
};
var workerDeno_env = {
  get: (name) => warnOrThrowIncompatible("Deno.env.get", [name]),
  set: (name, value) => warnOrThrowIncompatible("Deno.env.set", [name, value]),
  toObject: () => {
    warnOrThrowIncompatible("Deno.env.toObject");
    return {};
  }
};
var workerDeno_errors = {
  NotFound: class NotFound extends Error {
  },
  PermissionDenied: class PermissionDenied extends Error {
  },
  ConnectionAborted: class ConnectionRefused extends Error {
  },
  ConnectionReset: class ConnectionReset extends Error {
  },
  ConnectionRefused: class ConnectionAborted extends Error {
  },
  NotConnected: class NotConnected extends Error {
  },
  AddrInUse: class AddrInUse extends Error {
  },
  AddrNotAvailable: class AddrNotAvailable extends Error {
  },
  BrokenPipe: class BrokenPipe extends Error {
  },
  AlreadyExists: class AlreadyExists extends Error {
  },
  InvalidData: class InvalidData extends Error {
  },
  TimedOut: class TimedOut extends Error {
  },
  Interrupted: class Interrupted extends Error {
  },
  UnexpectedEof: class WriteZero extends Error {
  },
  WriteZero: class UnexpectedEof extends Error {
  },
  BadResource: class BadResource extends Error {
  },
  Http: class Http extends Error {
  },
  Busy: class Busy extends Error {
  }
};
var workerDeno_stat = (...args) => {
  warnOrThrowIncompatible("Deno.stat", args);
  return Promise.resolve({ isFile: false });
};
var workerDeno_mainModule = "file:///cloudflare-worker.js";
var base64abc = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "+",
  "/"
];
function encode(data2) {
  const uint8 = typeof data2 === "string" ? new TextEncoder().encode(data2) : data2 instanceof Uint8Array ? data2 : new Uint8Array(data2);
  let result = "", i;
  const l = uint8.length;
  for (i = 2; i < l; i += 3) {
    result += base64abc[uint8[i - 2] >> 2];
    result += base64abc[(uint8[i - 2] & 3) << 4 | uint8[i - 1] >> 4];
    result += base64abc[(uint8[i - 1] & 15) << 2 | uint8[i] >> 6];
    result += base64abc[uint8[i] & 63];
  }
  if (i === l + 1) {
    result += base64abc[uint8[i - 2] >> 2];
    result += base64abc[(uint8[i - 2] & 3) << 4];
    result += "==";
  }
  if (i === l) {
    result += base64abc[uint8[i - 2] >> 2];
    result += base64abc[(uint8[i - 2] & 3) << 4 | uint8[i - 1] >> 4];
    result += base64abc[(uint8[i - 1] & 15) << 2];
    result += "=";
  }
  return result;
}
function decode(b64) {
  const binString = atob(b64);
  const size = binString.length;
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return bytes;
}
var mod = {
  encode,
  decode
};
var hexTable = new TextEncoder().encode("0123456789abcdef");
function errInvalidByte(__byte) {
  return new TypeError(`Invalid byte '${String.fromCharCode(__byte)}'`);
}
function errLength() {
  return new RangeError("Odd length hex string");
}
function fromHexChar(__byte) {
  if (48 <= __byte && __byte <= 57)
    return __byte - 48;
  if (97 <= __byte && __byte <= 102)
    return __byte - 97 + 10;
  if (65 <= __byte && __byte <= 70)
    return __byte - 65 + 10;
  throw errInvalidByte(__byte);
}
function encode1(src) {
  const dst = new Uint8Array(src.length * 2);
  for (let i = 0; i < dst.length; i++) {
    const v = src[i];
    dst[i * 2] = hexTable[v >> 4];
    dst[i * 2 + 1] = hexTable[v & 15];
  }
  return dst;
}
function decode1(src) {
  const dst = new Uint8Array(src.length / 2);
  for (let i = 0; i < dst.length; i++) {
    const a = fromHexChar(src[i * 2]);
    const b = fromHexChar(src[i * 2 + 1]);
    dst[i] = a << 4 | b;
  }
  if (src.length % 2 == 1) {
    fromHexChar(src[dst.length * 2]);
    throw errLength();
  }
  return dst;
}
var mod1 = {
  encode: encode1,
  decode: decode1
};
var Tokenizer = class {
  rules;
  constructor(rules = []) {
    this.rules = rules;
  }
  addRule(test, fn) {
    this.rules.push({
      test,
      fn
    });
    return this;
  }
  tokenize(string, receiver = (token) => token) {
    function* generator(rules) {
      let index = 0;
      for (const rule of rules) {
        const result = rule.test(string);
        if (result) {
          const { value, length } = result;
          index += length;
          string = string.slice(length);
          const token = {
            ...rule.fn(value),
            index
          };
          yield receiver(token);
          yield* generator(rules);
        }
      }
    }
    const tokenGenerator = generator(this.rules);
    const tokens = [];
    for (const token of tokenGenerator) {
      tokens.push(token);
    }
    if (string.length) {
      throw new Error(`parser error: string not fully parsed! ${string.slice(0, 25)}`);
    }
    return tokens;
  }
};
function digits(value, count = 2) {
  return String(value).padStart(count, "0");
}
function createLiteralTestFunction(value) {
  return (string) => {
    return string.startsWith(value) ? {
      value,
      length: value.length
    } : void 0;
  };
}
function createMatchTestFunction(match) {
  return (string) => {
    const result = match.exec(string);
    if (result)
      return {
        value: result,
        length: result[0].length
      };
  };
}
var defaultRules = [
  {
    test: createLiteralTestFunction("yyyy"),
    fn: () => ({
      type: "year",
      value: "numeric"
    })
  },
  {
    test: createLiteralTestFunction("yy"),
    fn: () => ({
      type: "year",
      value: "2-digit"
    })
  },
  {
    test: createLiteralTestFunction("MM"),
    fn: () => ({
      type: "month",
      value: "2-digit"
    })
  },
  {
    test: createLiteralTestFunction("M"),
    fn: () => ({
      type: "month",
      value: "numeric"
    })
  },
  {
    test: createLiteralTestFunction("dd"),
    fn: () => ({
      type: "day",
      value: "2-digit"
    })
  },
  {
    test: createLiteralTestFunction("d"),
    fn: () => ({
      type: "day",
      value: "numeric"
    })
  },
  {
    test: createLiteralTestFunction("HH"),
    fn: () => ({
      type: "hour",
      value: "2-digit"
    })
  },
  {
    test: createLiteralTestFunction("H"),
    fn: () => ({
      type: "hour",
      value: "numeric"
    })
  },
  {
    test: createLiteralTestFunction("hh"),
    fn: () => ({
      type: "hour",
      value: "2-digit",
      hour12: true
    })
  },
  {
    test: createLiteralTestFunction("h"),
    fn: () => ({
      type: "hour",
      value: "numeric",
      hour12: true
    })
  },
  {
    test: createLiteralTestFunction("mm"),
    fn: () => ({
      type: "minute",
      value: "2-digit"
    })
  },
  {
    test: createLiteralTestFunction("m"),
    fn: () => ({
      type: "minute",
      value: "numeric"
    })
  },
  {
    test: createLiteralTestFunction("ss"),
    fn: () => ({
      type: "second",
      value: "2-digit"
    })
  },
  {
    test: createLiteralTestFunction("s"),
    fn: () => ({
      type: "second",
      value: "numeric"
    })
  },
  {
    test: createLiteralTestFunction("SSS"),
    fn: () => ({
      type: "fractionalSecond",
      value: 3
    })
  },
  {
    test: createLiteralTestFunction("SS"),
    fn: () => ({
      type: "fractionalSecond",
      value: 2
    })
  },
  {
    test: createLiteralTestFunction("S"),
    fn: () => ({
      type: "fractionalSecond",
      value: 1
    })
  },
  {
    test: createLiteralTestFunction("a"),
    fn: (value) => ({
      type: "dayPeriod",
      value
    })
  },
  {
    test: createMatchTestFunction(/^(')(?<value>\\.|[^\']*)\1/),
    fn: (match) => ({
      type: "literal",
      value: match.groups.value
    })
  },
  {
    test: createMatchTestFunction(/^.+?\s*/),
    fn: (match) => ({
      type: "literal",
      value: match[0]
    })
  }
];
var DateTimeFormatter = class {
  #format;
  constructor(formatString, rules = defaultRules) {
    const tokenizer = new Tokenizer(rules);
    this.#format = tokenizer.tokenize(formatString, ({ type, value, hour12 }) => {
      const result = {
        type,
        value
      };
      if (hour12)
        result.hour12 = hour12;
      return result;
    });
  }
  format(date, options = {}) {
    let string = "";
    const utc = options.timeZone === "UTC";
    for (const token of this.#format) {
      const type = token.type;
      switch (type) {
        case "year": {
          const value = utc ? date.getUTCFullYear() : date.getFullYear();
          switch (token.value) {
            case "numeric": {
              string += value;
              break;
            }
            case "2-digit": {
              string += digits(value, 2).slice(-2);
              break;
            }
            default:
              throw Error(`FormatterError: value "${token.value}" is not supported`);
          }
          break;
        }
        case "month": {
          const value1 = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
          switch (token.value) {
            case "numeric": {
              string += value1;
              break;
            }
            case "2-digit": {
              string += digits(value1, 2);
              break;
            }
            default:
              throw Error(`FormatterError: value "${token.value}" is not supported`);
          }
          break;
        }
        case "day": {
          const value2 = utc ? date.getUTCDate() : date.getDate();
          switch (token.value) {
            case "numeric": {
              string += value2;
              break;
            }
            case "2-digit": {
              string += digits(value2, 2);
              break;
            }
            default:
              throw Error(`FormatterError: value "${token.value}" is not supported`);
          }
          break;
        }
        case "hour": {
          let value3 = utc ? date.getUTCHours() : date.getHours();
          value3 -= token.hour12 && date.getHours() > 12 ? 12 : 0;
          switch (token.value) {
            case "numeric": {
              string += value3;
              break;
            }
            case "2-digit": {
              string += digits(value3, 2);
              break;
            }
            default:
              throw Error(`FormatterError: value "${token.value}" is not supported`);
          }
          break;
        }
        case "minute": {
          const value4 = utc ? date.getUTCMinutes() : date.getMinutes();
          switch (token.value) {
            case "numeric": {
              string += value4;
              break;
            }
            case "2-digit": {
              string += digits(value4, 2);
              break;
            }
            default:
              throw Error(`FormatterError: value "${token.value}" is not supported`);
          }
          break;
        }
        case "second": {
          const value5 = utc ? date.getUTCSeconds() : date.getSeconds();
          switch (token.value) {
            case "numeric": {
              string += value5;
              break;
            }
            case "2-digit": {
              string += digits(value5, 2);
              break;
            }
            default:
              throw Error(`FormatterError: value "${token.value}" is not supported`);
          }
          break;
        }
        case "fractionalSecond": {
          const value6 = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
          string += digits(value6, Number(token.value));
          break;
        }
        case "timeZoneName": {
          break;
        }
        case "dayPeriod": {
          string += token.value ? date.getHours() >= 12 ? "PM" : "AM" : "";
          break;
        }
        case "literal": {
          string += token.value;
          break;
        }
        default:
          throw Error(`FormatterError: { ${token.type} ${token.value} }`);
      }
    }
    return string;
  }
  parseToParts(string) {
    const parts = [];
    for (const token of this.#format) {
      const type = token.type;
      let value = "";
      switch (token.type) {
        case "year": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,4}/.exec(string)?.[0];
              break;
            }
            case "2-digit": {
              value = /^\d{1,2}/.exec(string)?.[0];
              break;
            }
          }
          break;
        }
        case "month": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,2}/.exec(string)?.[0];
              break;
            }
            case "2-digit": {
              value = /^\d{2}/.exec(string)?.[0];
              break;
            }
            case "narrow": {
              value = /^[a-zA-Z]+/.exec(string)?.[0];
              break;
            }
            case "short": {
              value = /^[a-zA-Z]+/.exec(string)?.[0];
              break;
            }
            case "long": {
              value = /^[a-zA-Z]+/.exec(string)?.[0];
              break;
            }
            default:
              throw Error(`ParserError: value "${token.value}" is not supported`);
          }
          break;
        }
        case "day": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,2}/.exec(string)?.[0];
              break;
            }
            case "2-digit": {
              value = /^\d{2}/.exec(string)?.[0];
              break;
            }
            default:
              throw Error(`ParserError: value "${token.value}" is not supported`);
          }
          break;
        }
        case "hour": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,2}/.exec(string)?.[0];
              if (token.hour12 && parseInt(value) > 12) {
                console.error(`Trying to parse hour greater than 12. Use 'H' instead of 'h'.`);
              }
              break;
            }
            case "2-digit": {
              value = /^\d{2}/.exec(string)?.[0];
              if (token.hour12 && parseInt(value) > 12) {
                console.error(`Trying to parse hour greater than 12. Use 'HH' instead of 'hh'.`);
              }
              break;
            }
            default:
              throw Error(`ParserError: value "${token.value}" is not supported`);
          }
          break;
        }
        case "minute": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,2}/.exec(string)?.[0];
              break;
            }
            case "2-digit": {
              value = /^\d{2}/.exec(string)?.[0];
              break;
            }
            default:
              throw Error(`ParserError: value "${token.value}" is not supported`);
          }
          break;
        }
        case "second": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,2}/.exec(string)?.[0];
              break;
            }
            case "2-digit": {
              value = /^\d{2}/.exec(string)?.[0];
              break;
            }
            default:
              throw Error(`ParserError: value "${token.value}" is not supported`);
          }
          break;
        }
        case "fractionalSecond": {
          value = new RegExp(`^\\d{${token.value}}`).exec(string)?.[0];
          break;
        }
        case "timeZoneName": {
          value = token.value;
          break;
        }
        case "dayPeriod": {
          value = /^(A|P)M/.exec(string)?.[0];
          break;
        }
        case "literal": {
          if (!string.startsWith(token.value)) {
            throw Error(`Literal "${token.value}" not found "${string.slice(0, 25)}"`);
          }
          value = token.value;
          break;
        }
        default:
          throw Error(`${token.type} ${token.value}`);
      }
      if (!value) {
        throw Error(`value not valid for token { ${type} ${value} } ${string.slice(0, 25)}`);
      }
      parts.push({
        type,
        value
      });
      string = string.slice(value.length);
    }
    if (string.length) {
      throw Error(`datetime string was not fully parsed! ${string.slice(0, 25)}`);
    }
    return parts;
  }
  sortDateTimeFormatPart(parts) {
    let result = [];
    const typeArray = [
      "year",
      "month",
      "day",
      "hour",
      "minute",
      "second",
      "fractionalSecond"
    ];
    for (const type of typeArray) {
      const current = parts.findIndex((el) => el.type === type);
      if (current !== -1) {
        result = result.concat(parts.splice(current, 1));
      }
    }
    result = result.concat(parts);
    return result;
  }
  partsToDate(parts) {
    const date = new Date();
    const utc = parts.find((part) => part.type === "timeZoneName" && part.value === "UTC");
    const dayPart = parts.find((part) => part.type === "day");
    utc ? date.setUTCHours(0, 0, 0, 0) : date.setHours(0, 0, 0, 0);
    for (const part of parts) {
      switch (part.type) {
        case "year": {
          const value = Number(part.value.padStart(4, "20"));
          utc ? date.setUTCFullYear(value) : date.setFullYear(value);
          break;
        }
        case "month": {
          const value1 = Number(part.value) - 1;
          if (dayPart) {
            utc ? date.setUTCMonth(value1, Number(dayPart.value)) : date.setMonth(value1, Number(dayPart.value));
          } else {
            utc ? date.setUTCMonth(value1) : date.setMonth(value1);
          }
          break;
        }
        case "day": {
          const value2 = Number(part.value);
          utc ? date.setUTCDate(value2) : date.setDate(value2);
          break;
        }
        case "hour": {
          let value3 = Number(part.value);
          const dayPeriod = parts.find((part2) => part2.type === "dayPeriod");
          if (dayPeriod?.value === "PM")
            value3 += 12;
          utc ? date.setUTCHours(value3) : date.setHours(value3);
          break;
        }
        case "minute": {
          const value4 = Number(part.value);
          utc ? date.setUTCMinutes(value4) : date.setMinutes(value4);
          break;
        }
        case "second": {
          const value5 = Number(part.value);
          utc ? date.setUTCSeconds(value5) : date.setSeconds(value5);
          break;
        }
        case "fractionalSecond": {
          const value6 = Number(part.value);
          utc ? date.setUTCMilliseconds(value6) : date.setMilliseconds(value6);
          break;
        }
      }
    }
    return date;
  }
  parse(string) {
    const parts = this.parseToParts(string);
    const sortParts = this.sortDateTimeFormatPart(parts);
    return this.partsToDate(sortParts);
  }
};
var SECOND = 1e3;
var MINUTE = 1e3 * 60;
var HOUR = MINUTE * 60;
var DAY = HOUR * 24;
var WEEK = DAY * 7;
var Day;
(function(Day2) {
  Day2[Day2["Sun"] = 0] = "Sun";
  Day2[Day2["Mon"] = 1] = "Mon";
  Day2[Day2["Tue"] = 2] = "Tue";
  Day2[Day2["Wed"] = 3] = "Wed";
  Day2[Day2["Thu"] = 4] = "Thu";
  Day2[Day2["Fri"] = 5] = "Fri";
  Day2[Day2["Sat"] = 6] = "Sat";
})(Day || (Day = {}));
function parse(dateString, formatString) {
  const formatter = new DateTimeFormatter(formatString);
  const parts = formatter.parseToParts(dateString);
  const sortParts = formatter.sortDateTimeFormatPart(parts);
  return formatter.partsToDate(sortParts);
}
function format(date, formatString) {
  const formatter = new DateTimeFormatter(formatString);
  return formatter.format(date);
}
function dayOfYear(date) {
  const yearStart = new Date(date);
  yearStart.setUTCFullYear(date.getUTCFullYear(), 0, 0);
  const diff = date.getTime() - yearStart.getTime();
  return Math.floor(diff / DAY);
}
function weekOfYear(date) {
  const workingDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = workingDate.getUTCDay();
  const nearestThursday = workingDate.getUTCDate() + Day.Thu - (day === Day.Sun ? 7 : day);
  workingDate.setUTCDate(nearestThursday);
  const yearStart = new Date(Date.UTC(workingDate.getUTCFullYear(), 0, 1));
  return Math.ceil((workingDate.getTime() - yearStart.getTime() + DAY) / WEEK);
}
function toIMF(date) {
  function dtPad(v, lPad = 2) {
    return v.padStart(lPad, "0");
  }
  const d = dtPad(date.getUTCDate().toString());
  const h = dtPad(date.getUTCHours().toString());
  const min = dtPad(date.getUTCMinutes().toString());
  const s = dtPad(date.getUTCSeconds().toString());
  const y = date.getUTCFullYear();
  const days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  return `${days[date.getUTCDay()]}, ${d} ${months[date.getUTCMonth()]} ${y} ${h}:${min}:${s} GMT`;
}
function isLeap(year) {
  const yearNumber = year instanceof Date ? year.getFullYear() : year;
  return yearNumber % 4 === 0 && yearNumber % 100 !== 0 || yearNumber % 400 === 0;
}
function difference(from, to, options) {
  const uniqueUnits = options?.units ? [
    ...new Set(options?.units)
  ] : [
    "milliseconds",
    "seconds",
    "minutes",
    "hours",
    "days",
    "weeks",
    "months",
    "quarters",
    "years"
  ];
  const bigger = Math.max(from.getTime(), to.getTime());
  const smaller = Math.min(from.getTime(), to.getTime());
  const differenceInMs = bigger - smaller;
  const differences = {};
  for (const uniqueUnit of uniqueUnits) {
    switch (uniqueUnit) {
      case "milliseconds":
        differences.milliseconds = differenceInMs;
        break;
      case "seconds":
        differences.seconds = Math.floor(differenceInMs / SECOND);
        break;
      case "minutes":
        differences.minutes = Math.floor(differenceInMs / MINUTE);
        break;
      case "hours":
        differences.hours = Math.floor(differenceInMs / HOUR);
        break;
      case "days":
        differences.days = Math.floor(differenceInMs / DAY);
        break;
      case "weeks":
        differences.weeks = Math.floor(differenceInMs / WEEK);
        break;
      case "months":
        differences.months = calculateMonthsDifference(bigger, smaller);
        break;
      case "quarters":
        differences.quarters = Math.floor(typeof differences.months !== "undefined" && differences.months / 4 || calculateMonthsDifference(bigger, smaller) / 4);
        break;
      case "years":
        differences.years = Math.floor(typeof differences.months !== "undefined" && differences.months / 12 || calculateMonthsDifference(bigger, smaller) / 12);
        break;
    }
  }
  return differences;
}
function calculateMonthsDifference(bigger, smaller) {
  const biggerDate = new Date(bigger);
  const smallerDate = new Date(smaller);
  const yearsDiff = biggerDate.getFullYear() - smallerDate.getFullYear();
  const monthsDiff = biggerDate.getMonth() - smallerDate.getMonth();
  const calendarDifferences = Math.abs(yearsDiff * 12 + monthsDiff);
  const compareResult = biggerDate > smallerDate ? 1 : -1;
  biggerDate.setMonth(biggerDate.getMonth() - compareResult * calendarDifferences);
  const isLastMonthNotFull = biggerDate > smallerDate ? 1 : -compareResult === -1 ? 1 : 0;
  const months = compareResult * (calendarDifferences - isLastMonthNotFull);
  return months === 0 ? 0 : months;
}
var mod2 = function() {
  return {
    SECOND: 1e3,
    MINUTE,
    HOUR,
    DAY,
    WEEK,
    parse,
    format,
    dayOfYear,
    weekOfYear,
    toIMF,
    isLeap,
    difference
  };
}();
var DenoStdInternalError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
};
function assert(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError(msg);
  }
}
function copy(src, dst, off = 0) {
  off = Math.max(0, Math.min(off, dst.byteLength));
  const dstBytesAvailable = dst.byteLength - off;
  if (src.byteLength > dstBytesAvailable) {
    src = src.subarray(0, dstBytesAvailable);
  }
  dst.set(src, off);
  return src.byteLength;
}
var MIN_BUF_SIZE = 16;
var CR = "\r".charCodeAt(0);
var LF = "\n".charCodeAt(0);
var BufferFullError = class extends Error {
  name;
  constructor(partial) {
    super("Buffer full");
    this.partial = partial;
    this.name = "BufferFullError";
  }
  partial;
};
var PartialReadError = class extends Error {
  name = "PartialReadError";
  partial;
  constructor() {
    super("Encountered UnexpectedEof, data only partially read");
  }
};
var BufReader = class {
  #buf;
  #rd;
  #r = 0;
  #w = 0;
  #eof = false;
  static create(r, size = 4096) {
    return r instanceof BufReader ? r : new BufReader(r, size);
  }
  constructor(rd, size = 4096) {
    if (size < 16) {
      size = MIN_BUF_SIZE;
    }
    this.#reset(new Uint8Array(size), rd);
  }
  size() {
    return this.#buf.byteLength;
  }
  buffered() {
    return this.#w - this.#r;
  }
  #fill = async () => {
    if (this.#r > 0) {
      this.#buf.copyWithin(0, this.#r, this.#w);
      this.#w -= this.#r;
      this.#r = 0;
    }
    if (this.#w >= this.#buf.byteLength) {
      throw Error("bufio: tried to fill full buffer");
    }
    for (let i = 100; i > 0; i--) {
      const rr = await this.#rd.read(this.#buf.subarray(this.#w));
      if (rr === null) {
        this.#eof = true;
        return;
      }
      assert(rr >= 0, "negative read");
      this.#w += rr;
      if (rr > 0) {
        return;
      }
    }
    throw new Error(`No progress after ${100} read() calls`);
  };
  reset(r) {
    this.#reset(this.#buf, r);
  }
  #reset = (buf, rd) => {
    this.#buf = buf;
    this.#rd = rd;
    this.#eof = false;
  };
  async read(p) {
    let rr = p.byteLength;
    if (p.byteLength === 0)
      return rr;
    if (this.#r === this.#w) {
      if (p.byteLength >= this.#buf.byteLength) {
        const rr1 = await this.#rd.read(p);
        const nread = rr1 ?? 0;
        assert(nread >= 0, "negative read");
        return rr1;
      }
      this.#r = 0;
      this.#w = 0;
      rr = await this.#rd.read(this.#buf);
      if (rr === 0 || rr === null)
        return rr;
      assert(rr >= 0, "negative read");
      this.#w += rr;
    }
    const copied = copy(this.#buf.subarray(this.#r, this.#w), p, 0);
    this.#r += copied;
    return copied;
  }
  async readFull(p) {
    let bytesRead = 0;
    while (bytesRead < p.length) {
      try {
        const rr = await this.read(p.subarray(bytesRead));
        if (rr === null) {
          if (bytesRead === 0) {
            return null;
          } else {
            throw new PartialReadError();
          }
        }
        bytesRead += rr;
      } catch (err) {
        if (err instanceof PartialReadError) {
          err.partial = p.subarray(0, bytesRead);
        } else if (err instanceof Error) {
          const e = new PartialReadError();
          e.partial = p.subarray(0, bytesRead);
          e.stack = err.stack;
          e.message = err.message;
          e.cause = err.cause;
          throw err;
        }
        throw err;
      }
    }
    return p;
  }
  async readByte() {
    while (this.#r === this.#w) {
      if (this.#eof)
        return null;
      await this.#fill();
    }
    const c = this.#buf[this.#r];
    this.#r++;
    return c;
  }
  async readString(delim) {
    if (delim.length !== 1) {
      throw new Error("Delimiter should be a single character");
    }
    const buffer = await this.readSlice(delim.charCodeAt(0));
    if (buffer === null)
      return null;
    return new TextDecoder().decode(buffer);
  }
  async readLine() {
    let line = null;
    try {
      line = await this.readSlice(LF);
    } catch (err) {
      if (err instanceof workerDeno_errors.BadResource) {
        throw err;
      }
      let partial;
      if (err instanceof PartialReadError) {
        partial = err.partial;
        assert(partial instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
      }
      if (!(err instanceof BufferFullError)) {
        throw err;
      }
      partial = err.partial;
      if (!this.#eof && partial && partial.byteLength > 0 && partial[partial.byteLength - 1] === CR) {
        assert(this.#r > 0, "bufio: tried to rewind past start of buffer");
        this.#r--;
        partial = partial.subarray(0, partial.byteLength - 1);
      }
      if (partial) {
        return {
          line: partial,
          more: !this.#eof
        };
      }
    }
    if (line === null) {
      return null;
    }
    if (line.byteLength === 0) {
      return {
        line,
        more: false
      };
    }
    if (line[line.byteLength - 1] == LF) {
      let drop = 1;
      if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
        drop = 2;
      }
      line = line.subarray(0, line.byteLength - drop);
    }
    return {
      line,
      more: false
    };
  }
  async readSlice(delim) {
    let s = 0;
    let slice;
    while (true) {
      let i = this.#buf.subarray(this.#r + s, this.#w).indexOf(delim);
      if (i >= 0) {
        i += s;
        slice = this.#buf.subarray(this.#r, this.#r + i + 1);
        this.#r += i + 1;
        break;
      }
      if (this.#eof) {
        if (this.#r === this.#w) {
          return null;
        }
        slice = this.#buf.subarray(this.#r, this.#w);
        this.#r = this.#w;
        break;
      }
      if (this.buffered() >= this.#buf.byteLength) {
        this.#r = this.#w;
        const oldbuf = this.#buf;
        const newbuf = this.#buf.slice(0);
        this.#buf = newbuf;
        throw new BufferFullError(oldbuf);
      }
      s = this.#w - this.#r;
      try {
        await this.#fill();
      } catch (err) {
        if (err instanceof PartialReadError) {
          err.partial = slice;
        } else if (err instanceof Error) {
          const e = new PartialReadError();
          e.partial = slice;
          e.stack = err.stack;
          e.message = err.message;
          e.cause = err.cause;
          throw err;
        }
        throw err;
      }
    }
    return slice;
  }
  async peek(n) {
    if (n < 0) {
      throw Error("negative count");
    }
    let avail = this.#w - this.#r;
    while (avail < n && avail < this.#buf.byteLength && !this.#eof) {
      try {
        await this.#fill();
      } catch (err) {
        if (err instanceof PartialReadError) {
          err.partial = this.#buf.subarray(this.#r, this.#w);
        } else if (err instanceof Error) {
          const e = new PartialReadError();
          e.partial = this.#buf.subarray(this.#r, this.#w);
          e.stack = err.stack;
          e.message = err.message;
          e.cause = err.cause;
          throw err;
        }
        throw err;
      }
      avail = this.#w - this.#r;
    }
    if (avail === 0 && this.#eof) {
      return null;
    } else if (avail < n && this.#eof) {
      return this.#buf.subarray(this.#r, this.#r + avail);
    } else if (avail < n) {
      throw new BufferFullError(this.#buf.subarray(this.#r, this.#w));
    }
    return this.#buf.subarray(this.#r, this.#r + n);
  }
};
var AbstractBufBase = class {
  buf;
  usedBufferBytes = 0;
  err = null;
  constructor(buf) {
    this.buf = buf;
  }
  size() {
    return this.buf.byteLength;
  }
  available() {
    return this.buf.byteLength - this.usedBufferBytes;
  }
  buffered() {
    return this.usedBufferBytes;
  }
};
var BufWriter = class extends AbstractBufBase {
  #writer;
  static create(writer, size = 4096) {
    return writer instanceof BufWriter ? writer : new BufWriter(writer, size);
  }
  constructor(writer, size = 4096) {
    super(new Uint8Array(size <= 0 ? 4096 : size));
    this.#writer = writer;
  }
  reset(w) {
    this.err = null;
    this.usedBufferBytes = 0;
    this.#writer = w;
  }
  async flush() {
    if (this.err !== null)
      throw this.err;
    if (this.usedBufferBytes === 0)
      return;
    try {
      const p = this.buf.subarray(0, this.usedBufferBytes);
      let nwritten = 0;
      while (nwritten < p.length) {
        nwritten += await this.#writer.write(p.subarray(nwritten));
      }
    } catch (e) {
      if (e instanceof Error) {
        this.err = e;
      }
      throw e;
    }
    this.buf = new Uint8Array(this.buf.length);
    this.usedBufferBytes = 0;
  }
  async write(data2) {
    if (this.err !== null)
      throw this.err;
    if (data2.length === 0)
      return 0;
    let totalBytesWritten = 0;
    let numBytesWritten = 0;
    while (data2.byteLength > this.available()) {
      if (this.buffered() === 0) {
        try {
          numBytesWritten = await this.#writer.write(data2);
        } catch (e) {
          if (e instanceof Error) {
            this.err = e;
          }
          throw e;
        }
      } else {
        numBytesWritten = copy(data2, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        await this.flush();
      }
      totalBytesWritten += numBytesWritten;
      data2 = data2.subarray(numBytesWritten);
    }
    numBytesWritten = copy(data2, this.buf, this.usedBufferBytes);
    this.usedBufferBytes += numBytesWritten;
    totalBytesWritten += numBytesWritten;
    return totalBytesWritten;
  }
};
var heap = new Array(32).fill(void 0);
heap.push(void 0, null, true, false);
var heap_next = heap.length;
var cachedTextDecoder = new TextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true
});
cachedTextDecoder.decode();
var cachedTextEncoder = new TextEncoder("utf-8");
function deferred() {
  let methods;
  let state = "pending";
  const promise = new Promise((resolve3, reject) => {
    methods = {
      async resolve(value) {
        await value;
        state = "fulfilled";
        resolve3(value);
      },
      reject(reason) {
        state = "rejected";
        reject(reason);
      }
    };
  });
  Object.defineProperty(promise, "state", {
    get: () => state
  });
  return Object.assign(promise, methods);
}
function delay(ms, options = {}) {
  const { signal } = options;
  if (signal?.aborted) {
    return Promise.reject(new DOMException("Delay was aborted.", "AbortError"));
  }
  return new Promise((resolve3, reject) => {
    const abort = () => {
      clearTimeout(i);
      reject(new DOMException("Delay was aborted.", "AbortError"));
    };
    const done = () => {
      signal?.removeEventListener("abort", abort);
      resolve3();
    };
    const i = setTimeout(done, ms);
    signal?.addEventListener("abort", abort, {
      once: true
    });
  });
}
var MuxAsyncIterator = class {
  iteratorCount = 0;
  yields = [];
  throws = [];
  signal = deferred();
  add(iterable) {
    ++this.iteratorCount;
    this.callIteratorNext(iterable[Symbol.asyncIterator]());
  }
  async callIteratorNext(iterator) {
    try {
      const { value, done } = await iterator.next();
      if (done) {
        --this.iteratorCount;
      } else {
        this.yields.push({
          iterator,
          value
        });
      }
    } catch (e) {
      this.throws.push(e);
    }
    this.signal.resolve();
  }
  async *iterate() {
    while (this.iteratorCount > 0) {
      await this.signal;
      for (let i = 0; i < this.yields.length; i++) {
        const { iterator, value } = this.yields[i];
        yield value;
        this.callIteratorNext(iterator);
      }
      if (this.throws.length) {
        for (const e of this.throws) {
          throw e;
        }
        this.throws.length = 0;
      }
      this.yields.length = 0;
      this.signal = deferred();
    }
  }
  [Symbol.asyncIterator]() {
    return this.iterate();
  }
};
var { Deno: Deno1 } = globalThis;
var noColor = typeof Deno1?.noColor === "boolean" ? Deno1.noColor : true;
var enabled = !noColor;
function code(open, close) {
  return {
    open: `\x1B[${open.join(";")}m`,
    close: `\x1B[${close}m`,
    regexp: new RegExp(`\\x1b\\[${close}m`, "g")
  };
}
function run(str, code2) {
  return enabled ? `${code2.open}${str.replace(code2.regexp, code2.open)}${code2.close}` : str;
}
function bold(str) {
  return run(str, code([
    1
  ], 22));
}
function yellow(str) {
  return run(str, code([
    33
  ], 39));
}
new RegExp([
  "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
  "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"
].join("|"), "g");
var osType = (() => {
  const { Deno: Deno12 } = globalThis;
  if (typeof Deno12?.build?.os === "string") {
    return Deno12.build.os;
  }
  const { navigator } = globalThis;
  if (navigator?.appVersion?.includes?.("Win")) {
    return "windows";
  }
  return "linux";
})();
var isWindows = osType === "windows";
var CHAR_FORWARD_SLASH = 47;
function assertPath(path2) {
  if (typeof path2 !== "string") {
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(path2)}`);
  }
}
function isPosixPathSeparator(code2) {
  return code2 === 47;
}
function isPathSeparator(code2) {
  return isPosixPathSeparator(code2) || code2 === 92;
}
function isWindowsDeviceRoot(code2) {
  return code2 >= 97 && code2 <= 122 || code2 >= 65 && code2 <= 90;
}
function normalizeString(path2, allowAboveRoot, separator, isPathSeparator2) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code2;
  for (let i = 0, len = path2.length; i <= len; ++i) {
    if (i < len)
      code2 = path2.charCodeAt(i);
    else if (isPathSeparator2(code2))
      break;
    else
      code2 = CHAR_FORWARD_SLASH;
    if (isPathSeparator2(code2)) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += `${separator}..`;
          else
            res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += separator + path2.slice(lastSlash + 1, i);
        else
          res = path2.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code2 === 46 && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format(sep3, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir)
    return base;
  if (dir === pathObject.root)
    return dir + base;
  return dir + sep3 + base;
}
var WHITESPACE_ENCODINGS = {
  "	": "%09",
  "\n": "%0A",
  "\v": "%0B",
  "\f": "%0C",
  "\r": "%0D",
  " ": "%20"
};
function encodeWhitespace(string) {
  return string.replaceAll(/[\s]/g, (c) => {
    return WHITESPACE_ENCODINGS[c] ?? c;
  });
}
var sep = "\\";
var delimiter = ";";
function resolve(...pathSegments) {
  let resolvedDevice = "";
  let resolvedTail = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1; i--) {
    let path2;
    const { Deno: Deno12 } = globalThis;
    if (i >= 0) {
      path2 = pathSegments[i];
    } else if (!resolvedDevice) {
      if (typeof Deno12?.cwd !== "function") {
        throw new TypeError("Resolved a drive-letter-less path without a CWD.");
      }
      path2 = Deno12.cwd();
    } else {
      if (typeof Deno12?.env?.get !== "function" || typeof Deno12?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path2 = Deno12.cwd();
      if (path2 === void 0 || path2.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
        path2 = `${resolvedDevice}\\`;
      }
    }
    assertPath(path2);
    const len = path2.length;
    if (len === 0)
      continue;
    let rootEnd = 0;
    let device = "";
    let isAbsolute3 = false;
    const code2 = path2.charCodeAt(0);
    if (len > 1) {
      if (isPathSeparator(code2)) {
        isAbsolute3 = true;
        if (isPathSeparator(path2.charCodeAt(1))) {
          let j = 2;
          let last = j;
          for (; j < len; ++j) {
            if (isPathSeparator(path2.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            const firstPart = path2.slice(last, j);
            last = j;
            for (; j < len; ++j) {
              if (!isPathSeparator(path2.charCodeAt(j)))
                break;
            }
            if (j < len && j !== last) {
              last = j;
              for (; j < len; ++j) {
                if (isPathSeparator(path2.charCodeAt(j)))
                  break;
              }
              if (j === len) {
                device = `\\\\${firstPart}\\${path2.slice(last)}`;
                rootEnd = j;
              } else if (j !== last) {
                device = `\\\\${firstPart}\\${path2.slice(last, j)}`;
                rootEnd = j;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot(code2)) {
        if (path2.charCodeAt(1) === 58) {
          device = path2.slice(0, 2);
          rootEnd = 2;
          if (len > 2) {
            if (isPathSeparator(path2.charCodeAt(2))) {
              isAbsolute3 = true;
              rootEnd = 3;
            }
          }
        }
      }
    } else if (isPathSeparator(code2)) {
      rootEnd = 1;
      isAbsolute3 = true;
    }
    if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
      continue;
    }
    if (resolvedDevice.length === 0 && device.length > 0) {
      resolvedDevice = device;
    }
    if (!resolvedAbsolute) {
      resolvedTail = `${path2.slice(rootEnd)}\\${resolvedTail}`;
      resolvedAbsolute = isAbsolute3;
    }
    if (resolvedAbsolute && resolvedDevice.length > 0)
      break;
  }
  resolvedTail = normalizeString(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator);
  return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize(path2) {
  assertPath(path2);
  const len = path2.length;
  if (len === 0)
    return ".";
  let rootEnd = 0;
  let device;
  let isAbsolute3 = false;
  const code2 = path2.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code2)) {
      isAbsolute3 = true;
      if (isPathSeparator(path2.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path2.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          const firstPart = path2.slice(last, j);
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path2.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path2.charCodeAt(j)))
                break;
            }
            if (j === len) {
              return `\\\\${firstPart}\\${path2.slice(last)}\\`;
            } else if (j !== last) {
              device = `\\\\${firstPart}\\${path2.slice(last, j)}`;
              rootEnd = j;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot(code2)) {
      if (path2.charCodeAt(1) === 58) {
        device = path2.slice(0, 2);
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path2.charCodeAt(2))) {
            isAbsolute3 = true;
            rootEnd = 3;
          }
        }
      }
    }
  } else if (isPathSeparator(code2)) {
    return "\\";
  }
  let tail;
  if (rootEnd < len) {
    tail = normalizeString(path2.slice(rootEnd), !isAbsolute3, "\\", isPathSeparator);
  } else {
    tail = "";
  }
  if (tail.length === 0 && !isAbsolute3)
    tail = ".";
  if (tail.length > 0 && isPathSeparator(path2.charCodeAt(len - 1))) {
    tail += "\\";
  }
  if (device === void 0) {
    if (isAbsolute3) {
      if (tail.length > 0)
        return `\\${tail}`;
      else
        return "\\";
    } else if (tail.length > 0) {
      return tail;
    } else {
      return "";
    }
  } else if (isAbsolute3) {
    if (tail.length > 0)
      return `${device}\\${tail}`;
    else
      return `${device}\\`;
  } else if (tail.length > 0) {
    return device + tail;
  } else {
    return device;
  }
}
function isAbsolute(path2) {
  assertPath(path2);
  const len = path2.length;
  if (len === 0)
    return false;
  const code2 = path2.charCodeAt(0);
  if (isPathSeparator(code2)) {
    return true;
  } else if (isWindowsDeviceRoot(code2)) {
    if (len > 2 && path2.charCodeAt(1) === 58) {
      if (isPathSeparator(path2.charCodeAt(2)))
        return true;
    }
  }
  return false;
}
function join(...paths) {
  const pathsCount = paths.length;
  if (pathsCount === 0)
    return ".";
  let joined;
  let firstPart = null;
  for (let i = 0; i < pathsCount; ++i) {
    const path2 = paths[i];
    assertPath(path2);
    if (path2.length > 0) {
      if (joined === void 0)
        joined = firstPart = path2;
      else
        joined += `\\${path2}`;
    }
  }
  if (joined === void 0)
    return ".";
  let needsReplace = true;
  let slashCount = 0;
  assert(firstPart != null);
  if (isPathSeparator(firstPart.charCodeAt(0))) {
    ++slashCount;
    const firstLen = firstPart.length;
    if (firstLen > 1) {
      if (isPathSeparator(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator(firstPart.charCodeAt(2)))
            ++slashCount;
          else {
            needsReplace = false;
          }
        }
      }
    }
  }
  if (needsReplace) {
    for (; slashCount < joined.length; ++slashCount) {
      if (!isPathSeparator(joined.charCodeAt(slashCount)))
        break;
    }
    if (slashCount >= 2)
      joined = `\\${joined.slice(slashCount)}`;
  }
  return normalize(joined);
}
function relative(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to)
    return "";
  const fromOrig = resolve(from);
  const toOrig = resolve(to);
  if (fromOrig === toOrig)
    return "";
  from = fromOrig.toLowerCase();
  to = toOrig.toLowerCase();
  if (from === to)
    return "";
  let fromStart = 0;
  let fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== 92)
      break;
  }
  for (; fromEnd - 1 > fromStart; --fromEnd) {
    if (from.charCodeAt(fromEnd - 1) !== 92)
      break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 0;
  let toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== 92)
      break;
  }
  for (; toEnd - 1 > toStart; --toEnd) {
    if (to.charCodeAt(toEnd - 1) !== 92)
      break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === 92) {
          return toOrig.slice(toStart + i + 1);
        } else if (i === 2) {
          return toOrig.slice(toStart + i);
        }
      }
      if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === 92) {
          lastCommonSep = i;
        } else if (i === 2) {
          lastCommonSep = 3;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (fromCode === 92)
      lastCommonSep = i;
  }
  if (i !== length && lastCommonSep === -1) {
    return toOrig;
  }
  let out = "";
  if (lastCommonSep === -1)
    lastCommonSep = 0;
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === 92) {
      if (out.length === 0)
        out += "..";
      else
        out += "\\..";
    }
  }
  if (out.length > 0) {
    return out + toOrig.slice(toStart + lastCommonSep, toEnd);
  } else {
    toStart += lastCommonSep;
    if (toOrig.charCodeAt(toStart) === 92)
      ++toStart;
    return toOrig.slice(toStart, toEnd);
  }
}
function toNamespacedPath(path2) {
  if (typeof path2 !== "string")
    return path2;
  if (path2.length === 0)
    return "";
  const resolvedPath = resolve(path2);
  if (resolvedPath.length >= 3) {
    if (resolvedPath.charCodeAt(0) === 92) {
      if (resolvedPath.charCodeAt(1) === 92) {
        const code2 = resolvedPath.charCodeAt(2);
        if (code2 !== 63 && code2 !== 46) {
          return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
        }
      }
    } else if (isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
      if (resolvedPath.charCodeAt(1) === 58 && resolvedPath.charCodeAt(2) === 92) {
        return `\\\\?\\${resolvedPath}`;
      }
    }
  }
  return path2;
}
function dirname(path2) {
  assertPath(path2);
  const len = path2.length;
  if (len === 0)
    return ".";
  let rootEnd = -1;
  let end = -1;
  let matchedSlash = true;
  let offset = 0;
  const code2 = path2.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code2)) {
      rootEnd = offset = 1;
      if (isPathSeparator(path2.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path2.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path2.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path2.charCodeAt(j)))
                break;
            }
            if (j === len) {
              return path2;
            }
            if (j !== last) {
              rootEnd = offset = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code2)) {
      if (path2.charCodeAt(1) === 58) {
        rootEnd = offset = 2;
        if (len > 2) {
          if (isPathSeparator(path2.charCodeAt(2)))
            rootEnd = offset = 3;
        }
      }
    }
  } else if (isPathSeparator(code2)) {
    return path2;
  }
  for (let i = len - 1; i >= offset; --i) {
    if (isPathSeparator(path2.charCodeAt(i))) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1) {
    if (rootEnd === -1)
      return ".";
    else
      end = rootEnd;
  }
  return path2.slice(0, end);
}
function basename(path2, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath(path2);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i;
  if (path2.length >= 2) {
    const drive = path2.charCodeAt(0);
    if (isWindowsDeviceRoot(drive)) {
      if (path2.charCodeAt(1) === 58)
        start = 2;
    }
  }
  if (ext !== void 0 && ext.length > 0 && ext.length <= path2.length) {
    if (ext.length === path2.length && ext === path2)
      return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i = path2.length - 1; i >= start; --i) {
      const code2 = path2.charCodeAt(i);
      if (isPathSeparator(code2)) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i + 1;
        }
        if (extIdx >= 0) {
          if (code2 === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end)
      end = firstNonSlashEnd;
    else if (end === -1)
      end = path2.length;
    return path2.slice(start, end);
  } else {
    for (i = path2.length - 1; i >= start; --i) {
      if (isPathSeparator(path2.charCodeAt(i))) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1)
      return "";
    return path2.slice(start, end);
  }
}
function extname(path2) {
  assertPath(path2);
  let start = 0;
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  if (path2.length >= 2 && path2.charCodeAt(1) === 58 && isWindowsDeviceRoot(path2.charCodeAt(0))) {
    start = startPart = 2;
  }
  for (let i = path2.length - 1; i >= start; --i) {
    const code2 = path2.charCodeAt(i);
    if (isPathSeparator(code2)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code2 === 46) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path2.slice(startDot, end);
}
function format1(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
  }
  return _format("\\", pathObject);
}
function parse1(path2) {
  assertPath(path2);
  const ret = {
    root: "",
    dir: "",
    base: "",
    ext: "",
    name: ""
  };
  const len = path2.length;
  if (len === 0)
    return ret;
  let rootEnd = 0;
  let code2 = path2.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code2)) {
      rootEnd = 1;
      if (isPathSeparator(path2.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path2.charCodeAt(j)))
            break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path2.charCodeAt(j)))
              break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path2.charCodeAt(j)))
                break;
            }
            if (j === len) {
              rootEnd = j;
            } else if (j !== last) {
              rootEnd = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot(code2)) {
      if (path2.charCodeAt(1) === 58) {
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path2.charCodeAt(2))) {
            if (len === 3) {
              ret.root = ret.dir = path2;
              return ret;
            }
            rootEnd = 3;
          }
        } else {
          ret.root = ret.dir = path2;
          return ret;
        }
      }
    }
  } else if (isPathSeparator(code2)) {
    ret.root = ret.dir = path2;
    return ret;
  }
  if (rootEnd > 0)
    ret.root = path2.slice(0, rootEnd);
  let startDot = -1;
  let startPart = rootEnd;
  let end = -1;
  let matchedSlash = true;
  let i = path2.length - 1;
  let preDotState = 0;
  for (; i >= rootEnd; --i) {
    code2 = path2.charCodeAt(i);
    if (isPathSeparator(code2)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code2 === 46) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      ret.base = ret.name = path2.slice(startPart, end);
    }
  } else {
    ret.name = path2.slice(startPart, startDot);
    ret.base = path2.slice(startPart, end);
    ret.ext = path2.slice(startDot, end);
  }
  if (startPart > 0 && startPart !== rootEnd) {
    ret.dir = path2.slice(0, startPart - 1);
  } else
    ret.dir = ret.root;
  return ret;
}
function fromFileUrl(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  let path2 = decodeURIComponent(url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname != "") {
    path2 = `\\\\${url.hostname}${path2}`;
  }
  return path2;
}
function toFileUrl(path2) {
  if (!isAbsolute(path2)) {
    throw new TypeError("Must be an absolute path.");
  }
  const [, hostname, pathname] = path2.match(/^(?:[/\\]{2}([^/\\]+)(?=[/\\](?:[^/\\]|$)))?(.*)/);
  const url = new URL("file:///");
  url.pathname = encodeWhitespace(pathname.replace(/%/g, "%25"));
  if (hostname != null && hostname != "localhost") {
    url.hostname = hostname;
    if (!url.hostname) {
      throw new TypeError("Invalid hostname.");
    }
  }
  return url;
}
var mod4 = {
  sep,
  delimiter,
  resolve,
  normalize,
  isAbsolute,
  join,
  relative,
  toNamespacedPath,
  dirname,
  basename,
  extname,
  format: format1,
  parse: parse1,
  fromFileUrl,
  toFileUrl
};
var sep1 = "/";
var delimiter1 = ":";
function resolve1(...pathSegments) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path2;
    if (i >= 0)
      path2 = pathSegments[i];
    else {
      const { Deno: Deno12 } = globalThis;
      if (typeof Deno12?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path2 = Deno12.cwd();
    }
    assertPath(path2);
    if (path2.length === 0) {
      continue;
    }
    resolvedPath = `${path2}/${resolvedPath}`;
    resolvedAbsolute = path2.charCodeAt(0) === CHAR_FORWARD_SLASH;
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator);
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0)
      return `/${resolvedPath}`;
    else
      return "/";
  } else if (resolvedPath.length > 0)
    return resolvedPath;
  else
    return ".";
}
function normalize1(path2) {
  assertPath(path2);
  if (path2.length === 0)
    return ".";
  const isAbsolute3 = path2.charCodeAt(0) === 47;
  const trailingSeparator = path2.charCodeAt(path2.length - 1) === 47;
  path2 = normalizeString(path2, !isAbsolute3, "/", isPosixPathSeparator);
  if (path2.length === 0 && !isAbsolute3)
    path2 = ".";
  if (path2.length > 0 && trailingSeparator)
    path2 += "/";
  if (isAbsolute3)
    return `/${path2}`;
  return path2;
}
function isAbsolute1(path2) {
  assertPath(path2);
  return path2.length > 0 && path2.charCodeAt(0) === 47;
}
function join1(...paths) {
  if (paths.length === 0)
    return ".";
  let joined;
  for (let i = 0, len = paths.length; i < len; ++i) {
    const path2 = paths[i];
    assertPath(path2);
    if (path2.length > 0) {
      if (!joined)
        joined = path2;
      else
        joined += `/${path2}`;
    }
  }
  if (!joined)
    return ".";
  return normalize1(joined);
}
function relative1(from, to) {
  assertPath(from);
  assertPath(to);
  if (from === to)
    return "";
  from = resolve1(from);
  to = resolve1(to);
  if (from === to)
    return "";
  let fromStart = 1;
  const fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== 47)
      break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 1;
  const toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== 47)
      break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === 47) {
          return to.slice(toStart + i + 1);
        } else if (i === 0) {
          return to.slice(toStart + i);
        }
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === 47) {
          lastCommonSep = i;
        } else if (i === 0) {
          lastCommonSep = 0;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (fromCode === 47)
      lastCommonSep = i;
  }
  let out = "";
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === 47) {
      if (out.length === 0)
        out += "..";
      else
        out += "/..";
    }
  }
  if (out.length > 0)
    return out + to.slice(toStart + lastCommonSep);
  else {
    toStart += lastCommonSep;
    if (to.charCodeAt(toStart) === 47)
      ++toStart;
    return to.slice(toStart);
  }
}
function toNamespacedPath1(path2) {
  return path2;
}
function dirname1(path2) {
  assertPath(path2);
  if (path2.length === 0)
    return ".";
  const hasRoot = path2.charCodeAt(0) === 47;
  let end = -1;
  let matchedSlash = true;
  for (let i = path2.length - 1; i >= 1; --i) {
    if (path2.charCodeAt(i) === 47) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      matchedSlash = false;
    }
  }
  if (end === -1)
    return hasRoot ? "/" : ".";
  if (hasRoot && end === 1)
    return "//";
  return path2.slice(0, end);
}
function basename1(path2, ext = "") {
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath(path2);
  let start = 0;
  let end = -1;
  let matchedSlash = true;
  let i;
  if (ext !== void 0 && ext.length > 0 && ext.length <= path2.length) {
    if (ext.length === path2.length && ext === path2)
      return "";
    let extIdx = ext.length - 1;
    let firstNonSlashEnd = -1;
    for (i = path2.length - 1; i >= 0; --i) {
      const code2 = path2.charCodeAt(i);
      if (code2 === 47) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1) {
          matchedSlash = false;
          firstNonSlashEnd = i + 1;
        }
        if (extIdx >= 0) {
          if (code2 === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1) {
              end = i;
            }
          } else {
            extIdx = -1;
            end = firstNonSlashEnd;
          }
        }
      }
    }
    if (start === end)
      end = firstNonSlashEnd;
    else if (end === -1)
      end = path2.length;
    return path2.slice(start, end);
  } else {
    for (i = path2.length - 1; i >= 0; --i) {
      if (path2.charCodeAt(i) === 47) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
    }
    if (end === -1)
      return "";
    return path2.slice(start, end);
  }
}
function extname1(path2) {
  assertPath(path2);
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let preDotState = 0;
  for (let i = path2.length - 1; i >= 0; --i) {
    const code2 = path2.charCodeAt(i);
    if (code2 === 47) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code2 === 46) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path2.slice(startDot, end);
}
function format2(pathObject) {
  if (pathObject === null || typeof pathObject !== "object") {
    throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
  }
  return _format("/", pathObject);
}
function parse2(path2) {
  assertPath(path2);
  const ret = {
    root: "",
    dir: "",
    base: "",
    ext: "",
    name: ""
  };
  if (path2.length === 0)
    return ret;
  const isAbsolute3 = path2.charCodeAt(0) === 47;
  let start;
  if (isAbsolute3) {
    ret.root = "/";
    start = 1;
  } else {
    start = 0;
  }
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let i = path2.length - 1;
  let preDotState = 0;
  for (; i >= start; --i) {
    const code2 = path2.charCodeAt(i);
    if (code2 === 47) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code2 === 46) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      if (startPart === 0 && isAbsolute3) {
        ret.base = ret.name = path2.slice(1, end);
      } else {
        ret.base = ret.name = path2.slice(startPart, end);
      }
    }
  } else {
    if (startPart === 0 && isAbsolute3) {
      ret.name = path2.slice(1, startDot);
      ret.base = path2.slice(1, end);
    } else {
      ret.name = path2.slice(startPart, startDot);
      ret.base = path2.slice(startPart, end);
    }
    ret.ext = path2.slice(startDot, end);
  }
  if (startPart > 0)
    ret.dir = path2.slice(0, startPart - 1);
  else if (isAbsolute3)
    ret.dir = "/";
  return ret;
}
function fromFileUrl1(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol != "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
function toFileUrl1(path2) {
  if (!isAbsolute1(path2)) {
    throw new TypeError("Must be an absolute path.");
  }
  const url = new URL("file:///");
  url.pathname = encodeWhitespace(path2.replace(/%/g, "%25").replace(/\\/g, "%5C"));
  return url;
}
var mod5 = {
  sep: sep1,
  delimiter: delimiter1,
  resolve: resolve1,
  normalize: normalize1,
  isAbsolute: isAbsolute1,
  join: join1,
  relative: relative1,
  toNamespacedPath: toNamespacedPath1,
  dirname: dirname1,
  basename: basename1,
  extname: extname1,
  format: format2,
  parse: parse2,
  fromFileUrl: fromFileUrl1,
  toFileUrl: toFileUrl1
};
var path = isWindows ? mod4 : mod5;
var { join: join2, normalize: normalize2 } = path;
var path1 = isWindows ? mod4 : mod5;
var { basename: basename2, delimiter: delimiter2, dirname: dirname2, extname: extname2, format: format3, fromFileUrl: fromFileUrl2, isAbsolute: isAbsolute2, join: join3, normalize: normalize3, parse: parse3, relative: relative2, resolve: resolve2, sep: sep2, toFileUrl: toFileUrl2, toNamespacedPath: toNamespacedPath2 } = path1;
var DeferredStack = class {
  #elements;
  #creator;
  #max_size;
  #queue;
  #size;
  constructor(max, ls, creator) {
    this.#elements = ls ? [
      ...ls
    ] : [];
    this.#creator = creator;
    this.#max_size = max || 10;
    this.#queue = [];
    this.#size = this.#elements.length;
  }
  get available() {
    return this.#elements.length;
  }
  async pop() {
    if (this.#elements.length > 0) {
      return this.#elements.pop();
    } else if (this.#size < this.#max_size && this.#creator) {
      this.#size++;
      return await this.#creator();
    }
    const d = deferred();
    this.#queue.push(d);
    return await d;
  }
  push(value) {
    if (this.#queue.length > 0) {
      const d = this.#queue.shift();
      d.resolve(value);
    } else {
      this.#elements.push(value);
    }
  }
  get size() {
    return this.#size;
  }
};
var DeferredAccessStack = class {
  #elements;
  #initializeElement;
  #checkElementInitialization;
  #queue;
  #size;
  get available() {
    return this.#elements.length;
  }
  get size() {
    return this.#size;
  }
  constructor(elements, initCallback, checkInitCallback) {
    this.#checkElementInitialization = checkInitCallback;
    this.#elements = elements;
    this.#initializeElement = initCallback;
    this.#queue = [];
    this.#size = elements.length;
  }
  async initialized() {
    const initialized = await Promise.all(this.#elements.map((e) => this.#checkElementInitialization(e)));
    return initialized.filter((initialized2) => initialized2 === true).length;
  }
  async pop() {
    let element;
    if (this.available > 0) {
      element = this.#elements.pop();
    } else {
      const d = deferred();
      this.#queue.push(d);
      element = await d;
    }
    if (!await this.#checkElementInitialization(element)) {
      await this.#initializeElement(element);
    }
    return element;
  }
  push(value) {
    if (this.#queue.length > 0) {
      const d = this.#queue.shift();
      d.resolve(value);
    } else {
      this.#elements.push(value);
    }
  }
};
function readInt16BE(buffer, offset) {
  offset = offset >>> 0;
  const val = buffer[offset + 1] | buffer[offset] << 8;
  return val & 32768 ? val | 4294901760 : val;
}
function readInt32BE(buffer, offset) {
  offset = offset >>> 0;
  return buffer[offset] << 24 | buffer[offset + 1] << 16 | buffer[offset + 2] << 8 | buffer[offset + 3];
}
function readUInt32BE(buffer, offset) {
  offset = offset >>> 0;
  return buffer[offset] * 16777216 + (buffer[offset + 1] << 16 | buffer[offset + 2] << 8 | buffer[offset + 3]);
}
function parseConnectionUri(uri) {
  const parsed_uri = uri.match(/(?<driver>\w+):\/{2}((?<user>[^\/?#\s:]+?)?(:(?<password>[^\/?#\s]+)?)?@)?(?<full_host>[^\/?#\s]+)?(\/(?<path>[^?#\s]*))?(\?(?<params>[^#\s]+))?.*/);
  if (!parsed_uri)
    throw new Error("Could not parse the provided URL");
  let { driver = "", full_host = "", params = "", password = "", path: path2 = "", user = "" } = parsed_uri.groups ?? {};
  const parsed_host = full_host.match(/(?<host>(\[.+\])|(.*?))(:(?<port>[\w]*))?$/);
  if (!parsed_host)
    throw new Error(`Could not parse "${full_host}" host`);
  let { host = "", port = "" } = parsed_host.groups ?? {};
  try {
    if (host) {
      host = decodeURIComponent(host);
    }
  } catch (_e) {
    console.error(bold(yellow("Failed to decode URL host") + "\nDefaulting to raw host"));
  }
  if (port && Number.isNaN(Number(port))) {
    throw new Error(`The provided port "${port}" is not a valid number`);
  }
  try {
    if (password) {
      password = decodeURIComponent(password);
    }
  } catch (_e1) {
    console.error(bold(yellow("Failed to decode URL password") + "\nDefaulting to raw password"));
  }
  return {
    driver,
    host,
    params: Object.fromEntries(new URLSearchParams(params).entries()),
    password,
    path: path2,
    port,
    user
  };
}
function isTemplateString(template) {
  if (!Array.isArray(template)) {
    return false;
  }
  return true;
}
var getSocketName = (port) => `.s.PGSQL.${port}`;
var PacketReader = class {
  #buffer;
  #decoder = new TextDecoder();
  #offset = 0;
  constructor(buffer) {
    this.#buffer = buffer;
  }
  readInt16() {
    const value = readInt16BE(this.#buffer, this.#offset);
    this.#offset += 2;
    return value;
  }
  readInt32() {
    const value = readInt32BE(this.#buffer, this.#offset);
    this.#offset += 4;
    return value;
  }
  readByte() {
    return this.readBytes(1)[0];
  }
  readBytes(length) {
    const start = this.#offset;
    const end = start + length;
    const slice = this.#buffer.slice(start, end);
    this.#offset = end;
    return slice;
  }
  readAllBytes() {
    const slice = this.#buffer.slice(this.#offset);
    this.#offset = this.#buffer.length;
    return slice;
  }
  readString(length) {
    const bytes = this.readBytes(length);
    return this.#decoder.decode(bytes);
  }
  readCString() {
    const start = this.#offset;
    const end = this.#buffer.indexOf(0, start);
    const slice = this.#buffer.slice(start, end);
    this.#offset = end + 1;
    return this.#decoder.decode(slice);
  }
};
var PacketWriter = class {
  #buffer;
  #encoder = new TextEncoder();
  #headerPosition;
  #offset;
  #size;
  constructor(size) {
    this.#size = size || 1024;
    this.#buffer = new Uint8Array(this.#size + 5);
    this.#offset = 5;
    this.#headerPosition = 0;
  }
  #ensure(size) {
    const remaining = this.#buffer.length - this.#offset;
    if (remaining < size) {
      const oldBuffer = this.#buffer;
      const newSize = oldBuffer.length + (oldBuffer.length >> 1) + size;
      this.#buffer = new Uint8Array(newSize);
      copy(oldBuffer, this.#buffer);
    }
  }
  addInt32(num) {
    this.#ensure(4);
    this.#buffer[this.#offset++] = num >>> 24 & 255;
    this.#buffer[this.#offset++] = num >>> 16 & 255;
    this.#buffer[this.#offset++] = num >>> 8 & 255;
    this.#buffer[this.#offset++] = num >>> 0 & 255;
    return this;
  }
  addInt16(num) {
    this.#ensure(2);
    this.#buffer[this.#offset++] = num >>> 8 & 255;
    this.#buffer[this.#offset++] = num >>> 0 & 255;
    return this;
  }
  addCString(string) {
    if (!string) {
      this.#ensure(1);
    } else {
      const encodedStr = this.#encoder.encode(string);
      this.#ensure(encodedStr.byteLength + 1);
      copy(encodedStr, this.#buffer, this.#offset);
      this.#offset += encodedStr.byteLength;
    }
    this.#buffer[this.#offset++] = 0;
    return this;
  }
  addChar(c) {
    if (c.length != 1) {
      throw new Error("addChar requires single character strings");
    }
    this.#ensure(1);
    copy(this.#encoder.encode(c), this.#buffer, this.#offset);
    this.#offset++;
    return this;
  }
  addString(string) {
    string = string || "";
    const encodedStr = this.#encoder.encode(string);
    this.#ensure(encodedStr.byteLength);
    copy(encodedStr, this.#buffer, this.#offset);
    this.#offset += encodedStr.byteLength;
    return this;
  }
  add(otherBuffer) {
    this.#ensure(otherBuffer.length);
    copy(otherBuffer, this.#buffer, this.#offset);
    this.#offset += otherBuffer.length;
    return this;
  }
  clear() {
    this.#offset = 5;
    this.#headerPosition = 0;
  }
  addHeader(code2, last) {
    const origOffset = this.#offset;
    this.#offset = this.#headerPosition;
    this.#buffer[this.#offset++] = code2;
    this.addInt32(origOffset - (this.#headerPosition + 1));
    this.#headerPosition = origOffset;
    this.#offset = origOffset;
    if (!last) {
      this.#ensure(5);
      this.#offset += 5;
    }
    return this;
  }
  join(code2) {
    if (code2) {
      this.addHeader(code2, true);
    }
    return this.#buffer.slice(code2 ? 0 : 5, this.#offset);
  }
  flush(code2) {
    const result = this.join(code2);
    this.clear();
    return result;
  }
};
var Oid = {
  bool: 16,
  bytea: 17,
  char: 18,
  name: 19,
  int8: 20,
  int2: 21,
  _int2vector_0: 22,
  int4: 23,
  regproc: 24,
  text: 25,
  oid: 26,
  tid: 27,
  xid: 28,
  _cid_0: 29,
  _oidvector_0: 30,
  _pg_ddl_command: 32,
  _pg_type: 71,
  _pg_attribute: 75,
  _pg_proc: 81,
  _pg_class: 83,
  json: 114,
  _xml_0: 142,
  _xml_1: 143,
  _pg_node_tree: 194,
  json_array: 199,
  _smgr: 210,
  _index_am_handler: 325,
  point: 600,
  lseg: 601,
  path: 602,
  box: 603,
  polygon: 604,
  line: 628,
  line_array: 629,
  cidr: 650,
  cidr_array: 651,
  float4: 700,
  float8: 701,
  _abstime_0: 702,
  _reltime_0: 703,
  _tinterval_0: 704,
  _unknown: 705,
  circle: 718,
  circle_array: 719,
  _money_0: 790,
  _money_1: 791,
  macaddr: 829,
  inet: 869,
  bool_array: 1e3,
  byte_array: 1001,
  char_array: 1002,
  name_array: 1003,
  int2_array: 1005,
  _int2vector_1: 1006,
  int4_array: 1007,
  regproc_array: 1008,
  text_array: 1009,
  tid_array: 1010,
  xid_array: 1011,
  _cid_1: 1012,
  _oidvector_1: 1013,
  bpchar_array: 1014,
  varchar_array: 1015,
  int8_array: 1016,
  point_array: 1017,
  lseg_array: 1018,
  path_array: 1019,
  box_array: 1020,
  float4_array: 1021,
  float8_array: 1022,
  _abstime_1: 1023,
  _reltime_1: 1024,
  _tinterval_1: 1025,
  polygon_array: 1027,
  oid_array: 1028,
  _aclitem_0: 1033,
  _aclitem_1: 1034,
  macaddr_array: 1040,
  inet_array: 1041,
  bpchar: 1042,
  varchar: 1043,
  date: 1082,
  time: 1083,
  timestamp: 1114,
  timestamp_array: 1115,
  date_array: 1182,
  time_array: 1183,
  timestamptz: 1184,
  timestamptz_array: 1185,
  _interval_0: 1186,
  _interval_1: 1187,
  numeric_array: 1231,
  _pg_database: 1248,
  _cstring_0: 1263,
  timetz: 1266,
  timetz_array: 1270,
  _bit_0: 1560,
  _bit_1: 1561,
  _varbit_0: 1562,
  _varbit_1: 1563,
  numeric: 1700,
  _refcursor_0: 1790,
  _refcursor_1: 2201,
  regprocedure: 2202,
  regoper: 2203,
  regoperator: 2204,
  regclass: 2205,
  regtype: 2206,
  regprocedure_array: 2207,
  regoper_array: 2208,
  regoperator_array: 2209,
  regclass_array: 2210,
  regtype_array: 2211,
  _record_0: 2249,
  _cstring_1: 2275,
  _any: 2276,
  _anyarray: 2277,
  void: 2278,
  _trigger: 2279,
  _language_handler: 2280,
  _internal: 2281,
  _opaque: 2282,
  _anyelement: 2283,
  _record_1: 2287,
  _anynonarray: 2776,
  _pg_authid: 2842,
  _pg_auth_members: 2843,
  _txid_snapshot_0: 2949,
  uuid: 2950,
  uuid_array: 2951,
  _txid_snapshot_1: 2970,
  _fdw_handler: 3115,
  _pg_lsn_0: 3220,
  _pg_lsn_1: 3221,
  _tsm_handler: 3310,
  _anyenum: 3500,
  _tsvector_0: 3614,
  _tsquery_0: 3615,
  _gtsvector_0: 3642,
  _tsvector_1: 3643,
  _gtsvector_1: 3644,
  _tsquery_1: 3645,
  regconfig: 3734,
  regconfig_array: 3735,
  regdictionary: 3769,
  regdictionary_array: 3770,
  jsonb: 3802,
  jsonb_array: 3807,
  _anyrange: 3831,
  _event_trigger: 3838,
  _int4range_0: 3904,
  _int4range_1: 3905,
  _numrange_0: 3906,
  _numrange_1: 3907,
  _tsrange_0: 3908,
  _tsrange_1: 3909,
  _tstzrange_0: 3910,
  _tstzrange_1: 3911,
  _daterange_0: 3912,
  _daterange_1: 3913,
  _int8range_0: 3926,
  _int8range_1: 3927,
  _pg_shseclabel: 4066,
  regnamespace: 4089,
  regnamespace_array: 4090,
  regrole: 4096,
  regrole_array: 4097
};
function parseArray(source, transform, separator = ",") {
  return new ArrayParser(source, transform, separator).parse();
}
var ArrayParser = class {
  position;
  entries;
  recorded;
  dimension;
  constructor(source, transform, separator) {
    this.source = source;
    this.transform = transform;
    this.separator = separator;
    this.position = 0;
    this.entries = [];
    this.recorded = [];
    this.dimension = 0;
  }
  isEof() {
    return this.position >= this.source.length;
  }
  nextCharacter() {
    const character = this.source[this.position++];
    if (character === "\\") {
      return {
        value: this.source[this.position++],
        escaped: true
      };
    }
    return {
      value: character,
      escaped: false
    };
  }
  record(character) {
    this.recorded.push(character);
  }
  newEntry(includeEmpty = false) {
    let entry;
    if (this.recorded.length > 0 || includeEmpty) {
      entry = this.recorded.join("");
      if (entry === "NULL" && !includeEmpty) {
        entry = null;
      }
      if (entry !== null)
        entry = this.transform(entry);
      this.entries.push(entry);
      this.recorded = [];
    }
  }
  consumeDimensions() {
    if (this.source[0] === "[") {
      while (!this.isEof()) {
        const __char = this.nextCharacter();
        if (__char.value === "=")
          break;
      }
    }
  }
  parse(nested = false) {
    let character, parser, quote;
    this.consumeDimensions();
    while (!this.isEof()) {
      character = this.nextCharacter();
      if (character.value === "{" && !quote) {
        this.dimension++;
        if (this.dimension > 1) {
          parser = new ArrayParser(this.source.substr(this.position - 1), this.transform, this.separator);
          this.entries.push(parser.parse(true));
          this.position += parser.position - 2;
        }
      } else if (character.value === "}" && !quote) {
        this.dimension--;
        if (!this.dimension) {
          this.newEntry();
          if (nested)
            return this.entries;
        }
      } else if (character.value === '"' && !character.escaped) {
        if (quote)
          this.newEntry(true);
        quote = !quote;
      } else if (character.value === this.separator && !quote) {
        this.newEntry();
      } else {
        this.record(character.value);
      }
    }
    if (this.dimension !== 0) {
      throw new Error("array dimension not balanced");
    }
    return this.entries;
  }
  source;
  transform;
  separator;
};
var BC_RE = /BC$/;
var DATETIME_RE = /^(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?/;
var HEX = 16;
var HEX_PREFIX_REGEX = /^\\x/;
var TIMEZONE_RE = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/;
function decodeBigint(value) {
  return BigInt(value);
}
function decodeBigintArray(value) {
  return parseArray(value, (x) => BigInt(x));
}
function decodeBoolean(value) {
  return value[0] === "t";
}
function decodeBooleanArray(value) {
  return parseArray(value, (x) => x[0] === "t");
}
function decodeBox(value) {
  const [a, b] = value.match(/\(.*?\)/g) || [];
  return {
    a: decodePoint(a),
    b: decodePoint(b)
  };
}
function decodeBoxArray(value) {
  return parseArray(value, decodeBox, ";");
}
function decodeBytea(byteaStr) {
  if (HEX_PREFIX_REGEX.test(byteaStr)) {
    return decodeByteaHex(byteaStr);
  } else {
    return decodeByteaEscape(byteaStr);
  }
}
function decodeByteaArray(value) {
  return parseArray(value, decodeBytea);
}
function decodeByteaEscape(byteaStr) {
  const bytes = [];
  let i = 0;
  let k = 0;
  while (i < byteaStr.length) {
    if (byteaStr[i] !== "\\") {
      bytes.push(byteaStr.charCodeAt(i));
      ++i;
    } else {
      if (/[0-7]{3}/.test(byteaStr.substr(i + 1, 3))) {
        bytes.push(parseInt(byteaStr.substr(i + 1, 3), 8));
        i += 4;
      } else {
        let backslashes = 1;
        while (i + backslashes < byteaStr.length && byteaStr[i + backslashes] === "\\") {
          backslashes++;
        }
        for (k = 0; k < Math.floor(backslashes / 2); ++k) {
          bytes.push(92);
        }
        i += Math.floor(backslashes / 2) * 2;
      }
    }
  }
  return new Uint8Array(bytes);
}
function decodeByteaHex(byteaStr) {
  const bytesStr = byteaStr.slice(2);
  const bytes = new Uint8Array(bytesStr.length / 2);
  for (let i = 0, j = 0; i < bytesStr.length; i += 2, j++) {
    bytes[j] = parseInt(bytesStr[i] + bytesStr[i + 1], HEX);
  }
  return bytes;
}
function decodeCircle(value) {
  const [point, radius] = value.substring(1, value.length - 1).split(/,(?![^(]*\))/);
  return {
    point: decodePoint(point),
    radius
  };
}
function decodeCircleArray(value) {
  return parseArray(value, decodeCircle);
}
function decodeDate(dateStr) {
  if (dateStr === "infinity") {
    return Number(Infinity);
  } else if (dateStr === "-infinity") {
    return Number(-Infinity);
  }
  return mod2.parse(dateStr, "yyyy-MM-dd");
}
function decodeDateArray(value) {
  return parseArray(value, decodeDate);
}
function decodeDatetime(dateStr) {
  const matches = DATETIME_RE.exec(dateStr);
  if (!matches) {
    return decodeDate(dateStr);
  }
  const isBC = BC_RE.test(dateStr);
  const year = parseInt(matches[1], 10) * (isBC ? -1 : 1);
  const month = parseInt(matches[2], 10) - 1;
  const day = parseInt(matches[3], 10);
  const hour = parseInt(matches[4], 10);
  const minute = parseInt(matches[5], 10);
  const second = parseInt(matches[6], 10);
  const msMatch = matches[7];
  const ms = msMatch ? 1e3 * parseFloat(msMatch) : 0;
  let date;
  const offset = decodeTimezoneOffset(dateStr);
  if (offset === null) {
    date = new Date(year, month, day, hour, minute, second, ms);
  } else {
    const utc = Date.UTC(year, month, day, hour, minute, second, ms);
    date = new Date(utc + offset);
  }
  date.setUTCFullYear(year);
  return date;
}
function decodeDatetimeArray(value) {
  return parseArray(value, decodeDatetime);
}
function decodeInt(value) {
  return parseInt(value, 10);
}
function decodeIntArray(value) {
  if (!value)
    return null;
  return parseArray(value, decodeInt);
}
function decodeJson(value) {
  return JSON.parse(value);
}
function decodeJsonArray(value) {
  return parseArray(value, JSON.parse);
}
function decodeLine(value) {
  const [a, b, c] = value.substring(1, value.length - 1).split(",");
  return {
    a,
    b,
    c
  };
}
function decodeLineArray(value) {
  return parseArray(value, decodeLine);
}
function decodeLineSegment(value) {
  const [a, b] = value.substring(1, value.length - 1).match(/\(.*?\)/g) || [];
  return {
    a: decodePoint(a),
    b: decodePoint(b)
  };
}
function decodeLineSegmentArray(value) {
  return parseArray(value, decodeLineSegment);
}
function decodePath(value) {
  const points = value.substring(1, value.length - 1).split(/,(?![^(]*\))/);
  return points.map(decodePoint);
}
function decodePathArray(value) {
  return parseArray(value, decodePath);
}
function decodePoint(value) {
  const [x, y] = value.substring(1, value.length - 1).split(",");
  if (Number.isNaN(parseFloat(x)) || Number.isNaN(parseFloat(y))) {
    throw new Error(`Invalid point value: "${Number.isNaN(parseFloat(x)) ? x : y}"`);
  }
  return {
    x,
    y
  };
}
function decodePointArray(value) {
  return parseArray(value, decodePoint);
}
function decodePolygon(value) {
  return decodePath(value);
}
function decodePolygonArray(value) {
  return parseArray(value, decodePolygon);
}
function decodeStringArray(value) {
  if (!value)
    return null;
  return parseArray(value, (value2) => value2);
}
function decodeTimezoneOffset(dateStr) {
  const timeStr = dateStr.split(" ")[1];
  const matches = TIMEZONE_RE.exec(timeStr);
  if (!matches) {
    return null;
  }
  const type = matches[1];
  if (type === "Z") {
    return 0;
  }
  const sign = type === "-" ? 1 : -1;
  const hours = parseInt(matches[2], 10);
  const minutes = parseInt(matches[3] || "0", 10);
  const seconds = parseInt(matches[4] || "0", 10);
  const offset = hours * 3600 + minutes * 60 + seconds;
  return sign * offset * 1e3;
}
function decodeTid(value) {
  const [x, y] = value.substring(1, value.length - 1).split(",");
  return [
    BigInt(x),
    BigInt(y)
  ];
}
function decodeTidArray(value) {
  return parseArray(value, decodeTid);
}
var Column = class {
  constructor(name, tableOid, index, typeOid, columnLength, typeModifier, format4) {
    this.name = name;
    this.tableOid = tableOid;
    this.index = index;
    this.typeOid = typeOid;
    this.columnLength = columnLength;
    this.typeModifier = typeModifier;
    this.format = format4;
  }
  name;
  tableOid;
  index;
  typeOid;
  columnLength;
  typeModifier;
  format;
};
var Format;
(function(Format2) {
  Format2[Format2["TEXT"] = 0] = "TEXT";
  Format2[Format2["BINARY"] = 1] = "BINARY";
})(Format || (Format = {}));
var decoder = new TextDecoder();
function decodeBinary() {
  throw new Error("Not implemented!");
}
function decodeText(value, typeOid) {
  const strValue = decoder.decode(value);
  switch (typeOid) {
    case Oid.bpchar:
    case Oid.char:
    case Oid.cidr:
    case Oid.float4:
    case Oid.float8:
    case Oid.inet:
    case Oid.macaddr:
    case Oid.name:
    case Oid.numeric:
    case Oid.oid:
    case Oid.regclass:
    case Oid.regconfig:
    case Oid.regdictionary:
    case Oid.regnamespace:
    case Oid.regoper:
    case Oid.regoperator:
    case Oid.regproc:
    case Oid.regprocedure:
    case Oid.regrole:
    case Oid.regtype:
    case Oid.text:
    case Oid.time:
    case Oid.timetz:
    case Oid.uuid:
    case Oid.varchar:
    case Oid.void:
      return strValue;
    case Oid.bpchar_array:
    case Oid.char_array:
    case Oid.cidr_array:
    case Oid.float4_array:
    case Oid.float8_array:
    case Oid.inet_array:
    case Oid.macaddr_array:
    case Oid.name_array:
    case Oid.numeric_array:
    case Oid.oid_array:
    case Oid.regclass_array:
    case Oid.regconfig_array:
    case Oid.regdictionary_array:
    case Oid.regnamespace_array:
    case Oid.regoper_array:
    case Oid.regoperator_array:
    case Oid.regproc_array:
    case Oid.regprocedure_array:
    case Oid.regrole_array:
    case Oid.regtype_array:
    case Oid.text_array:
    case Oid.time_array:
    case Oid.timetz_array:
    case Oid.uuid_array:
    case Oid.varchar_array:
      return decodeStringArray(strValue);
    case Oid.int2:
    case Oid.int4:
    case Oid.xid:
      return decodeInt(strValue);
    case Oid.int2_array:
    case Oid.int4_array:
    case Oid.xid_array:
      return decodeIntArray(strValue);
    case Oid.bool:
      return decodeBoolean(strValue);
    case Oid.bool_array:
      return decodeBooleanArray(strValue);
    case Oid.box:
      return decodeBox(strValue);
    case Oid.box_array:
      return decodeBoxArray(strValue);
    case Oid.circle:
      return decodeCircle(strValue);
    case Oid.circle_array:
      return decodeCircleArray(strValue);
    case Oid.bytea:
      return decodeBytea(strValue);
    case Oid.byte_array:
      return decodeByteaArray(strValue);
    case Oid.date:
      return decodeDate(strValue);
    case Oid.date_array:
      return decodeDateArray(strValue);
    case Oid.int8:
      return decodeBigint(strValue);
    case Oid.int8_array:
      return decodeBigintArray(strValue);
    case Oid.json:
    case Oid.jsonb:
      return decodeJson(strValue);
    case Oid.json_array:
    case Oid.jsonb_array:
      return decodeJsonArray(strValue);
    case Oid.line:
      return decodeLine(strValue);
    case Oid.line_array:
      return decodeLineArray(strValue);
    case Oid.lseg:
      return decodeLineSegment(strValue);
    case Oid.lseg_array:
      return decodeLineSegmentArray(strValue);
    case Oid.path:
      return decodePath(strValue);
    case Oid.path_array:
      return decodePathArray(strValue);
    case Oid.point:
      return decodePoint(strValue);
    case Oid.point_array:
      return decodePointArray(strValue);
    case Oid.polygon:
      return decodePolygon(strValue);
    case Oid.polygon_array:
      return decodePolygonArray(strValue);
    case Oid.tid:
      return decodeTid(strValue);
    case Oid.tid_array:
      return decodeTidArray(strValue);
    case Oid.timestamp:
    case Oid.timestamptz:
      return decodeDatetime(strValue);
    case Oid.timestamp_array:
    case Oid.timestamptz_array:
      return decodeDatetimeArray(strValue);
    default:
      return strValue;
  }
}
function decode2(value, column) {
  if (column.format === Format.BINARY) {
    return decodeBinary();
  } else if (column.format === Format.TEXT) {
    return decodeText(value, column.typeOid);
  } else {
    throw new Error(`Unknown column format: ${column.format}`);
  }
}
function pad(number, digits2) {
  let padded = "" + number;
  while (padded.length < digits2) {
    padded = "0" + padded;
  }
  return padded;
}
function encodeDate(date) {
  const year = pad(date.getFullYear(), 4);
  const month = pad(date.getMonth() + 1, 2);
  const day = pad(date.getDate(), 2);
  const hour = pad(date.getHours(), 2);
  const min = pad(date.getMinutes(), 2);
  const sec = pad(date.getSeconds(), 2);
  const ms = pad(date.getMilliseconds(), 3);
  const encodedDate = `${year}-${month}-${day}T${hour}:${min}:${sec}.${ms}`;
  const offset = date.getTimezoneOffset();
  const tzSign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const tzHours = pad(Math.floor(absOffset / 60), 2);
  const tzMinutes = pad(Math.floor(absOffset % 60), 2);
  const encodedTz = `${tzSign}${tzHours}:${tzMinutes}`;
  return encodedDate + encodedTz;
}
function escapeArrayElement(value) {
  const strValue = value.toString();
  const escapedValue = strValue.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"${escapedValue}"`;
}
function encodeArray(array) {
  let encodedArray = "{";
  array.forEach((element, index) => {
    if (index > 0) {
      encodedArray += ",";
    }
    if (element === null || typeof element === "undefined") {
      encodedArray += "NULL";
    } else if (Array.isArray(element)) {
      encodedArray += encodeArray(element);
    } else if (element instanceof Uint8Array) {
      throw new Error("Can't encode array of buffers.");
    } else {
      const encodedElement = encodeArgument(element);
      encodedArray += escapeArrayElement(encodedElement);
    }
  });
  encodedArray += "}";
  return encodedArray;
}
function encodeBytes(value) {
  const hex = Array.from(value).map((val) => val < 16 ? `0${val.toString(16)}` : val.toString(16)).join("");
  return `\\x${hex}`;
}
function encodeArgument(value) {
  if (value === null || typeof value === "undefined") {
    return null;
  } else if (value instanceof Uint8Array) {
    return encodeBytes(value);
  } else if (value instanceof Date) {
    return encodeDate(value);
  } else if (value instanceof Array) {
    return encodeArray(value);
  } else if (value instanceof Object) {
    return JSON.stringify(value);
  } else {
    return String(value);
  }
}
var commandTagRegexp = /^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/;
var ResultType;
(function(ResultType2) {
  ResultType2[ResultType2["ARRAY"] = 0] = "ARRAY";
  ResultType2[ResultType2["OBJECT"] = 1] = "OBJECT";
})(ResultType || (ResultType = {}));
var RowDescription = class {
  constructor(columnCount, columns) {
    this.columnCount = columnCount;
    this.columns = columns;
  }
  columnCount;
  columns;
};
function templateStringToQuery(template, args, result_type) {
  const text = template.reduce((curr, next, index) => {
    return `${curr}$${index}${next}`;
  });
  return new Query(text, result_type, args);
}
function objectQueryToQueryArgs(query, args) {
  args = normalizeObjectQueryArgs(args);
  let counter = 0;
  const clean_args = [];
  const clean_query = query.replaceAll(/(?<=\$)\w+/g, (match) => {
    match = match.toLowerCase();
    if (match in args) {
      clean_args.push(args[match]);
    } else {
      throw new Error(`No value was provided for the query argument "${match}"`);
    }
    return String(++counter);
  });
  return [
    clean_query,
    clean_args
  ];
}
function normalizeObjectQueryArgs(args) {
  const normalized_args = Object.fromEntries(Object.entries(args).map(([key, value]) => [
    key.toLowerCase(),
    value
  ]));
  if (Object.keys(normalized_args).length !== Object.keys(args).length) {
    throw new Error("The arguments provided for the query must be unique (insensitive)");
  }
  return normalized_args;
}
var QueryResult = class {
  command;
  rowCount;
  #row_description;
  warnings;
  get rowDescription() {
    return this.#row_description;
  }
  set rowDescription(row_description) {
    if (row_description && !this.#row_description) {
      this.#row_description = row_description;
    }
  }
  constructor(query) {
    this.query = query;
    this.warnings = [];
  }
  loadColumnDescriptions(description) {
    this.rowDescription = description;
  }
  handleCommandComplete(commandTag) {
    const match = commandTagRegexp.exec(commandTag);
    if (match) {
      this.command = match[1];
      if (match[3]) {
        this.rowCount = parseInt(match[3], 10);
      } else {
        this.rowCount = parseInt(match[2], 10);
      }
    }
  }
  insertRow(_row) {
    throw new Error("No implementation for insertRow is defined");
  }
  query;
};
var QueryArrayResult = class extends QueryResult {
  rows = [];
  insertRow(row_data) {
    if (!this.rowDescription) {
      throw new Error("The row descriptions required to parse the result data weren't initialized");
    }
    const row = row_data.map((raw_value, index) => {
      const column = this.rowDescription.columns[index];
      if (raw_value === null) {
        return null;
      }
      return decode2(raw_value, column);
    });
    this.rows.push(row);
  }
};
function findDuplicatesInArray(array) {
  return array.reduce((duplicates, item, index) => {
    const is_duplicate = array.indexOf(item) !== index;
    if (is_duplicate && !duplicates.includes(item)) {
      duplicates.push(item);
    }
    return duplicates;
  }, []);
}
function snakecaseToCamelcase(input) {
  return input.split("_").reduce((res, word, i) => {
    if (i !== 0) {
      word = word[0].toUpperCase() + word.slice(1);
    }
    res += word;
    return res;
  }, "");
}
var QueryObjectResult = class extends QueryResult {
  columns;
  rows = [];
  insertRow(row_data) {
    if (!this.rowDescription) {
      throw new Error("The row description required to parse the result data wasn't initialized");
    }
    if (!this.columns) {
      if (this.query.fields) {
        if (this.rowDescription.columns.length !== this.query.fields.length) {
          throw new RangeError(`The fields provided for the query don't match the ones returned as a result (${this.rowDescription.columns.length} expected, ${this.query.fields.length} received)`);
        }
        this.columns = this.query.fields;
      } else {
        let column_names;
        if (this.query.camelcase) {
          column_names = this.rowDescription.columns.map((column) => snakecaseToCamelcase(column.name));
        } else {
          column_names = this.rowDescription.columns.map((column) => column.name);
        }
        const duplicates = findDuplicatesInArray(column_names);
        if (duplicates.length) {
          throw new Error(`Field names ${duplicates.map((str) => `"${str}"`).join(", ")} are duplicated in the result of the query`);
        }
        this.columns = column_names;
      }
    }
    const columns = this.columns;
    if (columns.length !== row_data.length) {
      throw new RangeError("The result fields returned by the database don't match the defined structure of the result");
    }
    const row = row_data.reduce((row2, raw_value, index) => {
      const current_column = this.rowDescription.columns[index];
      if (raw_value === null) {
        row2[columns[index]] = null;
      } else {
        row2[columns[index]] = decode2(raw_value, current_column);
      }
      return row2;
    }, {});
    this.rows.push(row);
  }
};
var Query = class {
  args;
  camelcase;
  fields;
  result_type;
  text;
  constructor(config_or_text, result_type, args = []) {
    this.result_type = result_type;
    if (typeof config_or_text === "string") {
      if (!Array.isArray(args)) {
        [config_or_text, args] = objectQueryToQueryArgs(config_or_text, args);
      }
      this.text = config_or_text;
      this.args = args.map(encodeArgument);
    } else {
      let { args: args1 = [], camelcase, encoder: encoder2 = encodeArgument, fields, name, text } = config_or_text;
      if (fields) {
        const fields_are_clean = fields.every((field) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field));
        if (!fields_are_clean) {
          throw new TypeError("The fields provided for the query must contain only letters and underscores");
        }
        if (new Set(fields).size !== fields.length) {
          throw new TypeError("The fields provided for the query must be unique");
        }
        this.fields = fields;
      }
      this.camelcase = camelcase;
      if (!Array.isArray(args1)) {
        [text, args1] = objectQueryToQueryArgs(text, args1);
      }
      this.args = args1.map(encoder2);
      this.text = text;
    }
  }
};
var Message = class {
  reader;
  constructor(type, byteCount, body) {
    this.type = type;
    this.byteCount = byteCount;
    this.body = body;
    this.reader = new PacketReader(body);
  }
  type;
  byteCount;
  body;
};
function parseBackendKeyMessage(message) {
  return {
    pid: message.reader.readInt32(),
    secret_key: message.reader.readInt32()
  };
}
function parseCommandCompleteMessage(message) {
  return message.reader.readString(message.byteCount);
}
function parseNoticeMessage(message) {
  const error_fields = {};
  let __byte;
  let field_code;
  let field_value;
  while (__byte = message.reader.readByte()) {
    field_code = String.fromCharCode(__byte);
    field_value = message.reader.readCString();
    switch (field_code) {
      case "S":
        error_fields.severity = field_value;
        break;
      case "C":
        error_fields.code = field_value;
        break;
      case "M":
        error_fields.message = field_value;
        break;
      case "D":
        error_fields.detail = field_value;
        break;
      case "H":
        error_fields.hint = field_value;
        break;
      case "P":
        error_fields.position = field_value;
        break;
      case "p":
        error_fields.internalPosition = field_value;
        break;
      case "q":
        error_fields.internalQuery = field_value;
        break;
      case "W":
        error_fields.where = field_value;
        break;
      case "s":
        error_fields.schema = field_value;
        break;
      case "t":
        error_fields.table = field_value;
        break;
      case "c":
        error_fields.column = field_value;
        break;
      case "d":
        error_fields.dataTypeName = field_value;
        break;
      case "n":
        error_fields.constraint = field_value;
        break;
      case "F":
        error_fields.file = field_value;
        break;
      case "L":
        error_fields.line = field_value;
        break;
      case "R":
        error_fields.routine = field_value;
        break;
      default:
        break;
    }
  }
  return error_fields;
}
function parseRowDataMessage(message) {
  const field_count = message.reader.readInt16();
  const row = [];
  for (let i = 0; i < field_count; i++) {
    const col_length = message.reader.readInt32();
    if (col_length == -1) {
      row.push(null);
      continue;
    }
    row.push(message.reader.readBytes(col_length));
  }
  return row;
}
function parseRowDescriptionMessage(message) {
  const column_count = message.reader.readInt16();
  const columns = [];
  for (let i = 0; i < column_count; i++) {
    const column = new Column(message.reader.readCString(), message.reader.readInt32(), message.reader.readInt16(), message.reader.readInt32(), message.reader.readInt16(), message.reader.readInt32(), message.reader.readInt16());
    columns.push(column);
  }
  return new RowDescription(column_count, columns);
}
var defaultNonceSize = 16;
var text_encoder = new TextEncoder();
var AuthenticationState;
(function(AuthenticationState2) {
  AuthenticationState2[AuthenticationState2["Init"] = 0] = "Init";
  AuthenticationState2[AuthenticationState2["ClientChallenge"] = 1] = "ClientChallenge";
  AuthenticationState2[AuthenticationState2["ServerChallenge"] = 2] = "ServerChallenge";
  AuthenticationState2[AuthenticationState2["ClientResponse"] = 3] = "ClientResponse";
  AuthenticationState2[AuthenticationState2["ServerResponse"] = 4] = "ServerResponse";
  AuthenticationState2[AuthenticationState2["Failed"] = 5] = "Failed";
})(AuthenticationState || (AuthenticationState = {}));
var Reason;
(function(Reason2) {
  Reason2["BadMessage"] = "server sent an ill-formed message";
  Reason2["BadServerNonce"] = "server sent an invalid nonce";
  Reason2["BadSalt"] = "server specified an invalid salt";
  Reason2["BadIterationCount"] = "server specified an invalid iteration count";
  Reason2["BadVerifier"] = "server sent a bad verifier";
  Reason2["Rejected"] = "rejected by server";
})(Reason || (Reason = {}));
function assert1(cond) {
  if (!cond) {
    throw new Error("Scram protocol assertion failed");
  }
}
function assertValidScramString(str) {
  const unsafe = /[^\x21-\x7e]/;
  if (unsafe.test(str)) {
    throw new Error("scram username/password is currently limited to safe ascii characters");
  }
}
async function computeScramSignature(message, raw_key) {
  const key = await crypto.subtle.importKey("raw", raw_key, {
    name: "HMAC",
    hash: "SHA-256"
  }, false, [
    "sign"
  ]);
  return new Uint8Array(await crypto.subtle.sign({
    name: "HMAC",
    hash: "SHA-256"
  }, key, text_encoder.encode(message)));
}
function computeScramProof(signature, key) {
  const digest2 = new Uint8Array(signature.length);
  for (let i = 0; i < digest2.length; i++) {
    digest2[i] = signature[i] ^ key[i];
  }
  return digest2;
}
async function deriveKeySignatures(password, salt, iterations) {
  const pbkdf2_password = await crypto.subtle.importKey("raw", text_encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
    "deriveKey"
  ]);
  const key = await crypto.subtle.deriveKey({
    hash: "SHA-256",
    iterations,
    name: "PBKDF2",
    salt
  }, pbkdf2_password, {
    name: "HMAC",
    hash: "SHA-256",
    length: 256
  }, false, [
    "sign"
  ]);
  const client = new Uint8Array(await crypto.subtle.sign("HMAC", key, text_encoder.encode("Client Key")));
  const server = new Uint8Array(await crypto.subtle.sign("HMAC", key, text_encoder.encode("Server Key")));
  const stored = new Uint8Array(await crypto.subtle.digest("SHA-256", client));
  return {
    client,
    server,
    stored
  };
}
function escape(str) {
  return str.replace(/=/g, "=3D").replace(/,/g, "=2C");
}
function generateRandomNonce(size) {
  return mod.encode(crypto.getRandomValues(new Uint8Array(size)));
}
function parseScramAttributes(message) {
  const attrs = {};
  for (const entry of message.split(",")) {
    const pos = entry.indexOf("=");
    if (pos < 1) {
      throw new Error(Reason.BadMessage);
    }
    const key = entry.substr(0, pos);
    const value = entry.substr(pos + 1);
    attrs[key] = value;
  }
  return attrs;
}
var Client = class {
  #auth_message;
  #client_nonce;
  #key_signatures;
  #password;
  #server_nonce;
  #state;
  #username;
  constructor(username, password, nonce) {
    assertValidScramString(password);
    assertValidScramString(username);
    this.#auth_message = "";
    this.#client_nonce = nonce ?? generateRandomNonce(defaultNonceSize);
    this.#password = password;
    this.#state = AuthenticationState.Init;
    this.#username = escape(username);
  }
  composeChallenge() {
    assert1(this.#state === AuthenticationState.Init);
    try {
      const header = "n,,";
      const challenge = `n=${this.#username},r=${this.#client_nonce}`;
      const message = header + challenge;
      this.#auth_message += challenge;
      this.#state = AuthenticationState.ClientChallenge;
      return message;
    } catch (e) {
      this.#state = AuthenticationState.Failed;
      throw e;
    }
  }
  async receiveChallenge(challenge) {
    assert1(this.#state === AuthenticationState.ClientChallenge);
    try {
      const attrs = parseScramAttributes(challenge);
      const nonce = attrs.r;
      if (!attrs.r || !attrs.r.startsWith(this.#client_nonce)) {
        throw new Error(Reason.BadServerNonce);
      }
      this.#server_nonce = nonce;
      let salt;
      if (!attrs.s) {
        throw new Error(Reason.BadSalt);
      }
      try {
        salt = mod.decode(attrs.s);
      } catch {
        throw new Error(Reason.BadSalt);
      }
      const iterCount = parseInt(attrs.i) | 0;
      if (iterCount <= 0) {
        throw new Error(Reason.BadIterationCount);
      }
      this.#key_signatures = await deriveKeySignatures(this.#password, salt, iterCount);
      this.#auth_message += "," + challenge;
      this.#state = AuthenticationState.ServerChallenge;
    } catch (e) {
      this.#state = AuthenticationState.Failed;
      throw e;
    }
  }
  async composeResponse() {
    assert1(this.#state === AuthenticationState.ServerChallenge);
    assert1(this.#key_signatures);
    assert1(this.#server_nonce);
    try {
      const responseWithoutProof = `c=biws,r=${this.#server_nonce}`;
      this.#auth_message += "," + responseWithoutProof;
      const proof = mod.encode(computeScramProof(await computeScramSignature(this.#auth_message, this.#key_signatures.stored), this.#key_signatures.client));
      const message = `${responseWithoutProof},p=${proof}`;
      this.#state = AuthenticationState.ClientResponse;
      return message;
    } catch (e) {
      this.#state = AuthenticationState.Failed;
      throw e;
    }
  }
  async receiveResponse(response) {
    assert1(this.#state === AuthenticationState.ClientResponse);
    assert1(this.#key_signatures);
    try {
      const attrs = parseScramAttributes(response);
      if (attrs.e) {
        throw new Error(attrs.e ?? Reason.Rejected);
      }
      const verifier = mod.encode(await computeScramSignature(this.#auth_message, this.#key_signatures.server));
      if (attrs.v !== verifier) {
        throw new Error(Reason.BadVerifier);
      }
      this.#state = AuthenticationState.ServerResponse;
    } catch (e) {
      this.#state = AuthenticationState.Failed;
      throw e;
    }
  }
};
var ConnectionError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ConnectionError";
  }
};
var ConnectionParamsError = class extends Error {
  constructor(message, cause) {
    super(message, {
      cause
    });
    this.name = "ConnectionParamsError";
  }
};
var PostgresError = class extends Error {
  fields;
  constructor(fields) {
    super(fields.message);
    this.fields = fields;
    this.name = "PostgresError";
  }
};
var TransactionError = class extends Error {
  constructor(transaction_name, cause) {
    super(`The transaction "${transaction_name}" has been aborted`, {
      cause
    });
    this.name = "TransactionError";
  }
};
var ERROR_MESSAGE = "E";
var AUTHENTICATION_TYPE = {
  CLEAR_TEXT: 3,
  GSS_CONTINUE: 8,
  GSS_STARTUP: 7,
  MD5: 5,
  NO_AUTHENTICATION: 0,
  SASL_CONTINUE: 11,
  SASL_FINAL: 12,
  SASL_STARTUP: 10,
  SCM: 6,
  SSPI: 9
};
var INCOMING_AUTHENTICATION_MESSAGES = {
  AUTHENTICATION: "R",
  BACKEND_KEY: "K",
  PARAMETER_STATUS: "S",
  READY: "Z"
};
var INCOMING_TLS_MESSAGES = {
  ACCEPTS_TLS: "S",
  NO_ACCEPTS_TLS: "N"
};
var INCOMING_QUERY_MESSAGES = {
  BIND_COMPLETE: "2",
  PARSE_COMPLETE: "1",
  COMMAND_COMPLETE: "C",
  DATA_ROW: "D",
  EMPTY_QUERY: "I",
  NO_DATA: "n",
  NOTICE_WARNING: "N",
  PARAMETER_STATUS: "S",
  READY: "Z",
  ROW_DESCRIPTION: "T"
};
var encoder = new TextEncoder();
var decoder1 = new TextDecoder();
async function md5(bytes) {
  return decoder1.decode(mod1.encode(new Uint8Array(await crypto.subtle.digest("MD5", bytes))));
}
async function hashMd5Password(password, username, salt) {
  const innerHash = await md5(encoder.encode(password + username));
  const innerBytes = encoder.encode(innerHash);
  const outerBuffer = new Uint8Array(innerBytes.length + salt.length);
  outerBuffer.set(innerBytes);
  outerBuffer.set(salt, innerBytes.length);
  const outerHash = await md5(outerBuffer);
  return "md5" + outerHash;
}
function assertSuccessfulStartup(msg) {
  switch (msg.type) {
    case ERROR_MESSAGE:
      throw new PostgresError(parseNoticeMessage(msg));
  }
}
function assertSuccessfulAuthentication(auth_message) {
  if (auth_message.type === ERROR_MESSAGE) {
    throw new PostgresError(parseNoticeMessage(auth_message));
  }
  if (auth_message.type !== INCOMING_AUTHENTICATION_MESSAGES.AUTHENTICATION) {
    throw new Error(`Unexpected auth response: ${auth_message.type}.`);
  }
  const responseCode = auth_message.reader.readInt32();
  if (responseCode !== 0) {
    throw new Error(`Unexpected auth response code: ${responseCode}.`);
  }
}
function logNotice(notice) {
  console.error(`${bold(yellow(notice.severity))}: ${notice.message}`);
}
var decoder2 = new TextDecoder();
var encoder1 = new TextEncoder();
var Connection = class {
  #bufReader;
  #bufWriter;
  #conn;
  connected = false;
  #connection_params;
  #message_header = new Uint8Array(5);
  #onDisconnection;
  #packetWriter = new PacketWriter();
  #pid;
  #queryLock = new DeferredStack(1, [
    void 0
  ]);
  #secretKey;
  #tls;
  #transport;
  get pid() {
    return this.#pid;
  }
  get tls() {
    return this.#tls;
  }
  get transport() {
    return this.#transport;
  }
  constructor(connection_params, disconnection_callback) {
    this.#connection_params = connection_params;
    this.#onDisconnection = disconnection_callback;
  }
  async #readMessage() {
    this.#message_header.fill(0);
    await this.#bufReader.readFull(this.#message_header);
    const type = decoder2.decode(this.#message_header.slice(0, 1));
    if (type === "\0") {
      throw new ConnectionError("The session was terminated unexpectedly");
    }
    const length = readUInt32BE(this.#message_header, 1) - 4;
    const body = new Uint8Array(length);
    await this.#bufReader.readFull(body);
    return new Message(type, length, body);
  }
  async #serverAcceptsTLS() {
    const writer = this.#packetWriter;
    writer.clear();
    writer.addInt32(8).addInt32(80877103).join();
    await this.#bufWriter.write(writer.flush());
    await this.#bufWriter.flush();
    const response = new Uint8Array(1);
    await this.#conn.read(response);
    switch (String.fromCharCode(response[0])) {
      case INCOMING_TLS_MESSAGES.ACCEPTS_TLS:
        return true;
      case INCOMING_TLS_MESSAGES.NO_ACCEPTS_TLS:
        return false;
      default:
        throw new Error(`Could not check if server accepts SSL connections, server responded with: ${response}`);
    }
  }
  async #sendStartupMessage() {
    const writer1 = this.#packetWriter;
    writer1.clear();
    writer1.addInt16(3).addInt16(0);
    writer1.addCString("client_encoding").addCString("'utf-8'");
    writer1.addCString("user").addCString(this.#connection_params.user);
    writer1.addCString("database").addCString(this.#connection_params.database);
    writer1.addCString("application_name").addCString(this.#connection_params.applicationName);
    const connection_options = Object.entries(this.#connection_params.options);
    if (connection_options.length > 0) {
      writer1.addCString("options").addCString(connection_options.map(([key, value]) => `--${key}=${value}`).join(" "));
    }
    writer1.addCString("");
    const bodyBuffer = writer1.flush();
    const bodyLength = bodyBuffer.length + 4;
    writer1.clear();
    const finalBuffer = writer1.addInt32(bodyLength).add(bodyBuffer).join();
    await this.#bufWriter.write(finalBuffer);
    await this.#bufWriter.flush();
    return await this.#readMessage();
  }
  async #openConnection(options) {
    this.#conn = await workerDenoPostgres_connect(options);
    this.#bufWriter = new BufWriter(this.#conn);
    this.#bufReader = new BufReader(this.#conn);
  }
  async #openSocketConnection(path2, port) {
    if (workerDeno_build.os === "windows") {
      throw new Error("Socket connection is only available on UNIX systems");
    }
    const socket = await workerDeno_stat(path2);
    if (socket.isFile) {
      await this.#openConnection({
        path: path2,
        transport: "unix"
      });
    } else {
      const socket_guess = join3(path2, getSocketName(port));
      try {
        await this.#openConnection({
          path: socket_guess,
          transport: "unix"
        });
      } catch (e) {
        if (e instanceof workerDeno_errors.NotFound) {
          throw new ConnectionError(`Could not open socket in path "${socket_guess}"`);
        }
        throw e;
      }
    }
  }
  async #openTlsConnection(connection, options1) {
    this.#conn = await workerDenoPostgres_startTls(connection, options1);
    this.#bufWriter = new BufWriter(this.#conn);
    this.#bufReader = new BufReader(this.#conn);
  }
  #resetConnectionMetadata() {
    this.connected = false;
    this.#packetWriter = new PacketWriter();
    this.#pid = void 0;
    this.#queryLock = new DeferredStack(1, [
      void 0
    ]);
    this.#secretKey = void 0;
    this.#tls = void 0;
    this.#transport = void 0;
  }
  #closeConnection() {
    try {
      this.#conn.close();
    } catch (_e) {
    } finally {
      this.#resetConnectionMetadata();
    }
  }
  async #startup() {
    this.#closeConnection();
    const { hostname, host_type, port: port1, tls: { enabled: tls_enabled, enforce: tls_enforced, caCertificates } } = this.#connection_params;
    if (host_type === "socket") {
      await this.#openSocketConnection(hostname, port1);
      this.#tls = void 0;
      this.#transport = "socket";
    } else {
      await this.#openConnection({
        hostname,
        port: port1,
        transport: "tcp"
      });
      this.#tls = false;
      this.#transport = "tcp";
      if (tls_enabled) {
        const accepts_tls = await this.#serverAcceptsTLS().catch((e) => {
          this.#closeConnection();
          throw e;
        });
        if (accepts_tls) {
          try {
            await this.#openTlsConnection(this.#conn, {
              hostname,
              caCerts: caCertificates
            });
            this.#tls = true;
          } catch (e1) {
            if (!tls_enforced) {
              console.error(bold(yellow("TLS connection failed with message: ")) + e1.message + "\n" + bold("Defaulting to non-encrypted connection"));
              await this.#openConnection({
                hostname,
                port: port1,
                transport: "tcp"
              });
              this.#tls = false;
            } else {
              throw e1;
            }
          }
        } else if (tls_enforced) {
          this.#closeConnection();
          throw new Error("The server isn't accepting TLS connections. Change the client configuration so TLS configuration isn't required to connect");
        }
      }
    }
    try {
      let startup_response;
      try {
        startup_response = await this.#sendStartupMessage();
      } catch (e2) {
        this.#closeConnection();
        if (e2 instanceof workerDeno_errors.InvalidData && tls_enabled) {
          if (tls_enforced) {
            throw new Error("The certificate used to secure the TLS connection is invalid.");
          } else {
            console.error(bold(yellow("TLS connection failed with message: ")) + e2.message + "\n" + bold("Defaulting to non-encrypted connection"));
            await this.#openConnection({
              hostname,
              port: port1,
              transport: "tcp"
            });
            this.#tls = false;
            this.#transport = "tcp";
            startup_response = await this.#sendStartupMessage();
          }
        } else {
          throw e2;
        }
      }
      assertSuccessfulStartup(startup_response);
      await this.#authenticate(startup_response);
      let message = await this.#readMessage();
      while (message.type !== INCOMING_AUTHENTICATION_MESSAGES.READY) {
        switch (message.type) {
          case ERROR_MESSAGE:
            await this.#processErrorUnsafe(message, false);
            break;
          case INCOMING_AUTHENTICATION_MESSAGES.BACKEND_KEY: {
            const { pid, secret_key } = parseBackendKeyMessage(message);
            this.#pid = pid;
            this.#secretKey = secret_key;
            break;
          }
          case INCOMING_AUTHENTICATION_MESSAGES.PARAMETER_STATUS:
            break;
          default:
            throw new Error(`Unknown response for startup: ${message.type}`);
        }
        message = await this.#readMessage();
      }
      this.connected = true;
    } catch (e3) {
      this.#closeConnection();
      throw e3;
    }
  }
  async startup(is_reconnection) {
    if (is_reconnection && this.#connection_params.connection.attempts === 0) {
      throw new Error("The client has been disconnected from the database. Enable reconnection in the client to attempt reconnection after failure");
    }
    let reconnection_attempts = 0;
    const max_reconnections = this.#connection_params.connection.attempts;
    let error;
    if (!is_reconnection && this.#connection_params.connection.attempts === 0) {
      try {
        await this.#startup();
      } catch (e) {
        error = e;
      }
    } else {
      let interval = typeof this.#connection_params.connection.interval === "number" ? this.#connection_params.connection.interval : 0;
      while (reconnection_attempts < max_reconnections) {
        if (reconnection_attempts > 0) {
          if (typeof this.#connection_params.connection.interval === "function") {
            interval = this.#connection_params.connection.interval(interval);
          }
          if (interval > 0) {
            await delay(interval);
          }
        }
        try {
          await this.#startup();
          break;
        } catch (e1) {
          reconnection_attempts++;
          if (reconnection_attempts === max_reconnections) {
            error = e1;
          }
        }
      }
    }
    if (error) {
      await this.end();
      throw error;
    }
  }
  async #authenticate(authentication_request) {
    const authentication_type = authentication_request.reader.readInt32();
    let authentication_result;
    switch (authentication_type) {
      case AUTHENTICATION_TYPE.NO_AUTHENTICATION:
        authentication_result = authentication_request;
        break;
      case AUTHENTICATION_TYPE.CLEAR_TEXT:
        authentication_result = await this.#authenticateWithClearPassword();
        break;
      case AUTHENTICATION_TYPE.MD5: {
        const salt = authentication_request.reader.readBytes(4);
        authentication_result = await this.#authenticateWithMd5(salt);
        break;
      }
      case AUTHENTICATION_TYPE.SCM:
        throw new Error("Database server expected SCM authentication, which is not supported at the moment");
      case AUTHENTICATION_TYPE.GSS_STARTUP:
        throw new Error("Database server expected GSS authentication, which is not supported at the moment");
      case AUTHENTICATION_TYPE.GSS_CONTINUE:
        throw new Error("Database server expected GSS authentication, which is not supported at the moment");
      case AUTHENTICATION_TYPE.SSPI:
        throw new Error("Database server expected SSPI authentication, which is not supported at the moment");
      case AUTHENTICATION_TYPE.SASL_STARTUP:
        authentication_result = await this.#authenticateWithSasl();
        break;
      default:
        throw new Error(`Unknown auth message code ${authentication_type}`);
    }
    await assertSuccessfulAuthentication(authentication_result);
  }
  async #authenticateWithClearPassword() {
    this.#packetWriter.clear();
    const password = this.#connection_params.password || "";
    const buffer = this.#packetWriter.addCString(password).flush(112);
    await this.#bufWriter.write(buffer);
    await this.#bufWriter.flush();
    return this.#readMessage();
  }
  async #authenticateWithMd5(salt1) {
    this.#packetWriter.clear();
    if (!this.#connection_params.password) {
      throw new ConnectionParamsError("Attempting MD5 authentication with unset password");
    }
    const password1 = await hashMd5Password(this.#connection_params.password, this.#connection_params.user, salt1);
    const buffer1 = this.#packetWriter.addCString(password1).flush(112);
    await this.#bufWriter.write(buffer1);
    await this.#bufWriter.flush();
    return this.#readMessage();
  }
  async #authenticateWithSasl() {
    if (!this.#connection_params.password) {
      throw new ConnectionParamsError("Attempting SASL auth with unset password");
    }
    const client = new Client(this.#connection_params.user, this.#connection_params.password);
    const utf8 = new TextDecoder("utf-8");
    const clientFirstMessage = client.composeChallenge();
    this.#packetWriter.clear();
    this.#packetWriter.addCString("SCRAM-SHA-256");
    this.#packetWriter.addInt32(clientFirstMessage.length);
    this.#packetWriter.addString(clientFirstMessage);
    this.#bufWriter.write(this.#packetWriter.flush(112));
    this.#bufWriter.flush();
    const maybe_sasl_continue = await this.#readMessage();
    switch (maybe_sasl_continue.type) {
      case INCOMING_AUTHENTICATION_MESSAGES.AUTHENTICATION: {
        const authentication_type1 = maybe_sasl_continue.reader.readInt32();
        if (authentication_type1 !== AUTHENTICATION_TYPE.SASL_CONTINUE) {
          throw new Error(`Unexpected authentication type in SASL negotiation: ${authentication_type1}`);
        }
        break;
      }
      case ERROR_MESSAGE:
        throw new PostgresError(parseNoticeMessage(maybe_sasl_continue));
      default:
        throw new Error(`Unexpected message in SASL negotiation: ${maybe_sasl_continue.type}`);
    }
    const sasl_continue = utf8.decode(maybe_sasl_continue.reader.readAllBytes());
    await client.receiveChallenge(sasl_continue);
    this.#packetWriter.clear();
    this.#packetWriter.addString(await client.composeResponse());
    this.#bufWriter.write(this.#packetWriter.flush(112));
    this.#bufWriter.flush();
    const maybe_sasl_final = await this.#readMessage();
    switch (maybe_sasl_final.type) {
      case INCOMING_AUTHENTICATION_MESSAGES.AUTHENTICATION: {
        const authentication_type2 = maybe_sasl_final.reader.readInt32();
        if (authentication_type2 !== AUTHENTICATION_TYPE.SASL_FINAL) {
          throw new Error(`Unexpected authentication type in SASL finalization: ${authentication_type2}`);
        }
        break;
      }
      case ERROR_MESSAGE:
        throw new PostgresError(parseNoticeMessage(maybe_sasl_final));
      default:
        throw new Error(`Unexpected message in SASL finalization: ${maybe_sasl_continue.type}`);
    }
    const sasl_final = utf8.decode(maybe_sasl_final.reader.readAllBytes());
    await client.receiveResponse(sasl_final);
    return this.#readMessage();
  }
  async #simpleQuery(query) {
    this.#packetWriter.clear();
    const buffer2 = this.#packetWriter.addCString(query.text).flush(81);
    await this.#bufWriter.write(buffer2);
    await this.#bufWriter.flush();
    let result;
    if (query.result_type === ResultType.ARRAY) {
      result = new QueryArrayResult(query);
    } else {
      result = new QueryObjectResult(query);
    }
    let error;
    let current_message = await this.#readMessage();
    while (current_message.type !== INCOMING_QUERY_MESSAGES.READY) {
      switch (current_message.type) {
        case ERROR_MESSAGE:
          error = new PostgresError(parseNoticeMessage(current_message));
          break;
        case INCOMING_QUERY_MESSAGES.COMMAND_COMPLETE: {
          result.handleCommandComplete(parseCommandCompleteMessage(current_message));
          break;
        }
        case INCOMING_QUERY_MESSAGES.DATA_ROW: {
          const row_data = parseRowDataMessage(current_message);
          try {
            result.insertRow(row_data);
          } catch (e4) {
            error = e4;
          }
          break;
        }
        case INCOMING_QUERY_MESSAGES.EMPTY_QUERY:
          break;
        case INCOMING_QUERY_MESSAGES.NOTICE_WARNING: {
          const notice = parseNoticeMessage(current_message);
          logNotice(notice);
          result.warnings.push(notice);
          break;
        }
        case INCOMING_QUERY_MESSAGES.PARAMETER_STATUS:
          break;
        case INCOMING_QUERY_MESSAGES.READY:
          break;
        case INCOMING_QUERY_MESSAGES.ROW_DESCRIPTION: {
          result.loadColumnDescriptions(parseRowDescriptionMessage(current_message));
          break;
        }
        default:
          throw new Error(`Unexpected simple query message: ${current_message.type}`);
      }
      current_message = await this.#readMessage();
    }
    if (error)
      throw error;
    return result;
  }
  async #appendQueryToMessage(query1) {
    this.#packetWriter.clear();
    const buffer3 = this.#packetWriter.addCString("").addCString(query1.text).addInt16(0).flush(80);
    await this.#bufWriter.write(buffer3);
  }
  async #appendArgumentsToMessage(query2) {
    this.#packetWriter.clear();
    const hasBinaryArgs = query2.args.some((arg) => arg instanceof Uint8Array);
    this.#packetWriter.clear();
    this.#packetWriter.addCString("").addCString("");
    if (hasBinaryArgs) {
      this.#packetWriter.addInt16(query2.args.length);
      query2.args.forEach((arg) => {
        this.#packetWriter.addInt16(arg instanceof Uint8Array ? 1 : 0);
      });
    } else {
      this.#packetWriter.addInt16(0);
    }
    this.#packetWriter.addInt16(query2.args.length);
    query2.args.forEach((arg) => {
      if (arg === null || typeof arg === "undefined") {
        this.#packetWriter.addInt32(-1);
      } else if (arg instanceof Uint8Array) {
        this.#packetWriter.addInt32(arg.length);
        this.#packetWriter.add(arg);
      } else {
        const byteLength = encoder1.encode(arg).length;
        this.#packetWriter.addInt32(byteLength);
        this.#packetWriter.addString(arg);
      }
    });
    this.#packetWriter.addInt16(0);
    const buffer4 = this.#packetWriter.flush(66);
    await this.#bufWriter.write(buffer4);
  }
  async #appendDescribeToMessage() {
    this.#packetWriter.clear();
    const buffer5 = this.#packetWriter.addCString("P").flush(68);
    await this.#bufWriter.write(buffer5);
  }
  async #appendExecuteToMessage() {
    this.#packetWriter.clear();
    const buffer6 = this.#packetWriter.addCString("").addInt32(0).flush(69);
    await this.#bufWriter.write(buffer6);
  }
  async #appendSyncToMessage() {
    this.#packetWriter.clear();
    const buffer7 = this.#packetWriter.flush(83);
    await this.#bufWriter.write(buffer7);
  }
  async #processErrorUnsafe(msg, recoverable = true) {
    const error1 = new PostgresError(parseNoticeMessage(msg));
    if (recoverable) {
      let maybe_ready_message = await this.#readMessage();
      while (maybe_ready_message.type !== INCOMING_QUERY_MESSAGES.READY) {
        maybe_ready_message = await this.#readMessage();
      }
    }
    throw error1;
  }
  async #preparedQuery(query3) {
    await this.#appendQueryToMessage(query3);
    await this.#appendArgumentsToMessage(query3);
    await this.#appendDescribeToMessage();
    await this.#appendExecuteToMessage();
    await this.#appendSyncToMessage();
    await this.#bufWriter.flush();
    let result1;
    if (query3.result_type === ResultType.ARRAY) {
      result1 = new QueryArrayResult(query3);
    } else {
      result1 = new QueryObjectResult(query3);
    }
    let error2;
    let current_message1 = await this.#readMessage();
    while (current_message1.type !== INCOMING_QUERY_MESSAGES.READY) {
      switch (current_message1.type) {
        case ERROR_MESSAGE: {
          error2 = new PostgresError(parseNoticeMessage(current_message1));
          break;
        }
        case INCOMING_QUERY_MESSAGES.BIND_COMPLETE:
          break;
        case INCOMING_QUERY_MESSAGES.COMMAND_COMPLETE: {
          result1.handleCommandComplete(parseCommandCompleteMessage(current_message1));
          break;
        }
        case INCOMING_QUERY_MESSAGES.DATA_ROW: {
          const row_data1 = parseRowDataMessage(current_message1);
          try {
            result1.insertRow(row_data1);
          } catch (e5) {
            error2 = e5;
          }
          break;
        }
        case INCOMING_QUERY_MESSAGES.NO_DATA:
          break;
        case INCOMING_QUERY_MESSAGES.NOTICE_WARNING: {
          const notice1 = parseNoticeMessage(current_message1);
          logNotice(notice1);
          result1.warnings.push(notice1);
          break;
        }
        case INCOMING_QUERY_MESSAGES.PARAMETER_STATUS:
          break;
        case INCOMING_QUERY_MESSAGES.PARSE_COMPLETE:
          break;
        case INCOMING_QUERY_MESSAGES.ROW_DESCRIPTION: {
          result1.loadColumnDescriptions(parseRowDescriptionMessage(current_message1));
          break;
        }
        default:
          throw new Error(`Unexpected prepared query message: ${current_message1.type}`);
      }
      current_message1 = await this.#readMessage();
    }
    if (error2)
      throw error2;
    return result1;
  }
  async query(query) {
    if (!this.connected) {
      await this.startup(true);
    }
    await this.#queryLock.pop();
    try {
      if (query.args.length === 0) {
        return await this.#simpleQuery(query);
      } else {
        return await this.#preparedQuery(query);
      }
    } catch (e) {
      if (e instanceof ConnectionError) {
        await this.end();
      }
      throw e;
    } finally {
      this.#queryLock.push(void 0);
    }
  }
  async end() {
    if (this.connected) {
      const terminationMessage = new Uint8Array([
        88,
        0,
        0,
        0,
        4
      ]);
      await this.#bufWriter.write(terminationMessage);
      try {
        await this.#bufWriter.flush();
      } catch (_e) {
      } finally {
        this.#closeConnection();
        this.#onDisconnection();
      }
    }
  }
};
function getPgEnv() {
  return {
    applicationName: workerDeno_env.get("PGAPPNAME"),
    database: workerDeno_env.get("PGDATABASE"),
    hostname: workerDeno_env.get("PGHOST"),
    options: workerDeno_env.get("PGOPTIONS"),
    password: workerDeno_env.get("PGPASSWORD"),
    port: workerDeno_env.get("PGPORT"),
    user: workerDeno_env.get("PGUSER")
  };
}
function formatMissingParams(missingParams) {
  return `Missing connection parameters: ${missingParams.join(", ")}`;
}
function assertRequiredOptions(options, requiredKeys, has_env_access) {
  const missingParams = [];
  for (const key of requiredKeys) {
    if (options[key] === "" || options[key] === null || options[key] === void 0) {
      missingParams.push(key);
    }
  }
  if (missingParams.length) {
    let missing_params_message = formatMissingParams(missingParams);
    if (!has_env_access) {
      missing_params_message += "\nConnection parameters can be read from environment variables only if Deno is run with env permission";
    }
    throw new ConnectionParamsError(missing_params_message);
  }
}
function parseOptionsArgument(options) {
  const args = options.split(" ");
  const transformed_args = [];
  for (let x = 0; x < args.length; x++) {
    if (/^-\w/.test(args[x])) {
      if (args[x] === "-c") {
        if (args[x + 1] === void 0) {
          throw new Error(`No provided value for "${args[x]}" in options parameter`);
        }
        transformed_args.push(args[x + 1]);
        x++;
      } else {
        throw new Error(`Argument "${args[x]}" is not supported in options parameter`);
      }
    } else if (/^--\w/.test(args[x])) {
      transformed_args.push(args[x].slice(2));
    } else {
      throw new Error(`Value "${args[x]}" is not a valid options argument`);
    }
  }
  return transformed_args.reduce((options2, x) => {
    if (!/.+=.+/.test(x)) {
      throw new Error(`Value "${x}" is not a valid options argument`);
    }
    const key = x.slice(0, x.indexOf("="));
    const value = x.slice(x.indexOf("=") + 1);
    options2[key] = value;
    return options2;
  }, {});
}
function parseOptionsFromUri(connection_string) {
  let postgres_uri;
  try {
    const uri = parseConnectionUri(connection_string);
    postgres_uri = {
      application_name: uri.params.application_name,
      dbname: uri.path || uri.params.dbname,
      driver: uri.driver,
      host: uri.host || uri.params.host,
      options: uri.params.options,
      password: uri.password || uri.params.password,
      port: uri.port || uri.params.port,
      sslmode: uri.params.ssl === "true" ? "require" : uri.params.sslmode,
      user: uri.user || uri.params.user
    };
  } catch (e) {
    throw new ConnectionParamsError(`Could not parse the connection string`, e);
  }
  if (![
    "postgres",
    "postgresql"
  ].includes(postgres_uri.driver)) {
    throw new ConnectionParamsError(`Supplied DSN has invalid driver: ${postgres_uri.driver}.`);
  }
  const host_type = postgres_uri.host ? isAbsolute2(postgres_uri.host) ? "socket" : "tcp" : "socket";
  const options = postgres_uri.options ? parseOptionsArgument(postgres_uri.options) : {};
  let tls;
  switch (postgres_uri.sslmode) {
    case void 0: {
      break;
    }
    case "disable": {
      tls = {
        enabled: false,
        enforce: false,
        caCertificates: []
      };
      break;
    }
    case "prefer": {
      tls = {
        enabled: true,
        enforce: false,
        caCertificates: []
      };
      break;
    }
    case "require":
    case "verify-ca":
    case "verify-full": {
      tls = {
        enabled: true,
        enforce: true,
        caCertificates: []
      };
      break;
    }
    default: {
      throw new ConnectionParamsError(`Supplied DSN has invalid sslmode '${postgres_uri.sslmode}'`);
    }
  }
  return {
    applicationName: postgres_uri.application_name,
    database: postgres_uri.dbname,
    hostname: postgres_uri.host,
    host_type,
    options,
    password: postgres_uri.password,
    port: postgres_uri.port,
    tls,
    user: postgres_uri.user
  };
}
var DEFAULT_OPTIONS = {
  applicationName: "deno_postgres",
  connection: {
    attempts: 1,
    interval: (previous_interval) => previous_interval + 500
  },
  host: "127.0.0.1",
  socket: "/tmp",
  host_type: "socket",
  options: {},
  port: 5432,
  tls: {
    enabled: true,
    enforce: false,
    caCertificates: []
  }
};
function createParams(params = {}) {
  if (typeof params === "string") {
    params = parseOptionsFromUri(params);
  }
  let pgEnv = {};
  let has_env_access = true;
  try {
    pgEnv = getPgEnv();
  } catch (e) {
    if (e instanceof workerDeno_errors.PermissionDenied) {
      has_env_access = false;
    } else {
      throw e;
    }
  }
  const provided_host = params.hostname ?? pgEnv.hostname;
  const host_type = params.host_type ?? (provided_host ? "tcp" : DEFAULT_OPTIONS.host_type);
  if (![
    "tcp",
    "socket"
  ].includes(host_type)) {
    throw new ConnectionParamsError(`"${host_type}" is not a valid host type`);
  }
  let host;
  if (host_type === "socket") {
    const socket = provided_host ?? DEFAULT_OPTIONS.socket;
    try {
      if (!isAbsolute2(socket)) {
        const parsed_host = new URL(socket, workerDeno_mainModule);
        if (parsed_host.protocol === "file:") {
          host = fromFileUrl2(parsed_host);
        } else {
          throw new ConnectionParamsError("The provided host is not a file path");
        }
      } else {
        host = socket;
      }
    } catch (e1) {
      throw new ConnectionParamsError(`Could not parse host "${socket}"`, e1);
    }
  } else {
    host = provided_host ?? DEFAULT_OPTIONS.host;
  }
  const provided_options = params.options ?? pgEnv.options;
  let options;
  if (provided_options) {
    if (typeof provided_options === "string") {
      options = parseOptionsArgument(provided_options);
    } else {
      options = provided_options;
    }
  } else {
    options = {};
  }
  for (const key in options) {
    if (!/^\w+$/.test(key)) {
      throw new Error(`The "${key}" key in the options argument is invalid`);
    }
    options[key] = options[key].replaceAll(" ", "\\ ");
  }
  let port;
  if (params.port) {
    port = Number(params.port);
  } else if (pgEnv.port) {
    port = Number(pgEnv.port);
  } else {
    port = DEFAULT_OPTIONS.port;
  }
  if (Number.isNaN(port) || port === 0) {
    throw new ConnectionParamsError(`"${params.port ?? pgEnv.port}" is not a valid port number`);
  }
  if (host_type === "socket" && params?.tls) {
    throw new ConnectionParamsError(`No TLS options are allowed when host type is set to "socket"`);
  }
  const tls_enabled = !!(params?.tls?.enabled ?? DEFAULT_OPTIONS.tls.enabled);
  const tls_enforced = !!(params?.tls?.enforce ?? DEFAULT_OPTIONS.tls.enforce);
  if (!tls_enabled && tls_enforced) {
    throw new ConnectionParamsError("Can't enforce TLS when client has TLS encryption is disabled");
  }
  const connection_options = {
    applicationName: params.applicationName ?? pgEnv.applicationName ?? DEFAULT_OPTIONS.applicationName,
    connection: {
      attempts: params?.connection?.attempts ?? DEFAULT_OPTIONS.connection.attempts,
      interval: params?.connection?.interval ?? DEFAULT_OPTIONS.connection.interval
    },
    database: params.database ?? pgEnv.database,
    hostname: host,
    host_type,
    options,
    password: params.password ?? pgEnv.password,
    port,
    tls: {
      enabled: tls_enabled,
      enforce: tls_enforced,
      caCertificates: params?.tls?.caCertificates ?? []
    },
    user: params.user ?? pgEnv.user
  };
  assertRequiredOptions(connection_options, [
    "applicationName",
    "database",
    "hostname",
    "host_type",
    "port",
    "user"
  ], has_env_access);
  return connection_options;
}
var Savepoint = class {
  #instance_count;
  #release_callback;
  #update_callback;
  constructor(name, update_callback, release_callback) {
    this.name = name;
    this.#instance_count = 0;
    this.#release_callback = release_callback;
    this.#update_callback = update_callback;
  }
  get instances() {
    return this.#instance_count;
  }
  async release() {
    if (this.#instance_count === 0) {
      throw new Error("This savepoint has no instances to release");
    }
    await this.#release_callback(this.name);
    --this.#instance_count;
  }
  async update() {
    await this.#update_callback(this.name);
    ++this.#instance_count;
  }
  name;
};
var Transaction = class {
  #client;
  #executeQuery;
  #isolation_level;
  #read_only;
  #savepoints;
  #snapshot;
  #updateClientLock;
  constructor(name, options, client, execute_query_callback, update_client_lock_callback) {
    this.name = name;
    this.#savepoints = [];
    this.#committed = false;
    this.#client = client;
    this.#executeQuery = execute_query_callback;
    this.#isolation_level = options?.isolation_level ?? "read_committed";
    this.#read_only = options?.read_only ?? false;
    this.#snapshot = options?.snapshot;
    this.#updateClientLock = update_client_lock_callback;
  }
  get isolation_level() {
    return this.#isolation_level;
  }
  get savepoints() {
    return this.#savepoints;
  }
  #assertTransactionOpen() {
    if (this.#client.session.current_transaction !== this.name) {
      throw new Error(`This transaction has not been started yet, make sure to use the "begin" method to do so`);
    }
  }
  #resetTransaction() {
    this.#savepoints = [];
  }
  async begin() {
    if (this.#client.session.current_transaction !== null) {
      if (this.#client.session.current_transaction === this.name) {
        throw new Error("This transaction is already open");
      }
      throw new Error(`This client already has an ongoing transaction "${this.#client.session.current_transaction}"`);
    }
    let isolation_level;
    switch (this.#isolation_level) {
      case "read_committed": {
        isolation_level = "READ COMMITTED";
        break;
      }
      case "repeatable_read": {
        isolation_level = "REPEATABLE READ";
        break;
      }
      case "serializable": {
        isolation_level = "SERIALIZABLE";
        break;
      }
      default:
        throw new Error(`Unexpected isolation level "${this.#isolation_level}"`);
    }
    let permissions;
    if (this.#read_only) {
      permissions = "READ ONLY";
    } else {
      permissions = "READ WRITE";
    }
    let snapshot = "";
    if (this.#snapshot) {
      snapshot = `SET TRANSACTION SNAPSHOT '${this.#snapshot}'`;
    }
    try {
      await this.#client.queryArray(`BEGIN ${permissions} ISOLATION LEVEL ${isolation_level};${snapshot}`);
    } catch (e) {
      if (e instanceof PostgresError) {
        throw new TransactionError(this.name, e);
      } else {
        throw e;
      }
    }
    this.#updateClientLock(this.name);
  }
  #committed;
  async commit(options) {
    this.#assertTransactionOpen();
    const chain = options?.chain ?? false;
    if (!this.#committed) {
      this.#committed = true;
      try {
        await this.queryArray(`COMMIT ${chain ? "AND CHAIN" : ""}`);
      } catch (e) {
        if (e instanceof PostgresError) {
          throw new TransactionError(this.name, e);
        } else {
          throw e;
        }
      }
    }
    this.#resetTransaction();
    if (!chain) {
      this.#updateClientLock(null);
    }
  }
  getSavepoint(name) {
    return this.#savepoints.find((sv) => sv.name === name.toLowerCase());
  }
  getSavepoints() {
    return this.#savepoints.filter(({ instances }) => instances > 0).map(({ name }) => name);
  }
  async getSnapshot() {
    this.#assertTransactionOpen();
    const { rows } = await this.queryObject`SELECT PG_EXPORT_SNAPSHOT() AS SNAPSHOT;`;
    return rows[0].snapshot;
  }
  async queryArray(query_template_or_config, ...args) {
    this.#assertTransactionOpen();
    let query;
    if (typeof query_template_or_config === "string") {
      query = new Query(query_template_or_config, ResultType.ARRAY, args[0]);
    } else if (isTemplateString(query_template_or_config)) {
      query = templateStringToQuery(query_template_or_config, args, ResultType.ARRAY);
    } else {
      query = new Query(query_template_or_config, ResultType.ARRAY);
    }
    try {
      return await this.#executeQuery(query);
    } catch (e) {
      if (e instanceof PostgresError) {
        await this.commit();
        throw new TransactionError(this.name, e);
      } else {
        throw e;
      }
    }
  }
  async queryObject(query_template_or_config, ...args) {
    this.#assertTransactionOpen();
    let query;
    if (typeof query_template_or_config === "string") {
      query = new Query(query_template_or_config, ResultType.OBJECT, args[0]);
    } else if (isTemplateString(query_template_or_config)) {
      query = templateStringToQuery(query_template_or_config, args, ResultType.OBJECT);
    } else {
      query = new Query(query_template_or_config, ResultType.OBJECT);
    }
    try {
      return await this.#executeQuery(query);
    } catch (e) {
      if (e instanceof PostgresError) {
        await this.commit();
        throw new TransactionError(this.name, e);
      } else {
        throw e;
      }
    }
  }
  async rollback(savepoint_or_options) {
    this.#assertTransactionOpen();
    let savepoint_option;
    if (typeof savepoint_or_options === "string" || savepoint_or_options instanceof Savepoint) {
      savepoint_option = savepoint_or_options;
    } else {
      savepoint_option = savepoint_or_options?.savepoint;
    }
    let savepoint_name;
    if (savepoint_option instanceof Savepoint) {
      savepoint_name = savepoint_option.name;
    } else if (typeof savepoint_option === "string") {
      savepoint_name = savepoint_option.toLowerCase();
    }
    let chain_option = false;
    if (typeof savepoint_or_options === "object") {
      chain_option = savepoint_or_options?.chain ?? false;
    }
    if (chain_option && savepoint_name) {
      throw new Error("The chain option can't be used alongside a savepoint on a rollback operation");
    }
    if (typeof savepoint_option !== "undefined") {
      const ts_savepoint = this.#savepoints.find(({ name }) => name === savepoint_name);
      if (!ts_savepoint) {
        throw new Error(`There is no "${savepoint_name}" savepoint registered in this transaction`);
      }
      if (!ts_savepoint.instances) {
        throw new Error(`There are no savepoints of "${savepoint_name}" left to rollback to`);
      }
      await this.queryArray(`ROLLBACK TO ${savepoint_name}`);
      return;
    }
    try {
      await this.queryArray(`ROLLBACK ${chain_option ? "AND CHAIN" : ""}`);
    } catch (e) {
      if (e instanceof PostgresError) {
        await this.commit();
        throw new TransactionError(this.name, e);
      } else {
        throw e;
      }
    }
    this.#resetTransaction();
    if (!chain_option) {
      this.#updateClientLock(null);
    }
  }
  async savepoint(name) {
    this.#assertTransactionOpen();
    if (!/^[a-zA-Z_]{1}[\w]{0,62}$/.test(name)) {
      if (!Number.isNaN(Number(name[0]))) {
        throw new Error("The savepoint name can't begin with a number");
      }
      if (name.length > 63) {
        throw new Error("The savepoint name can't be longer than 63 characters");
      }
      throw new Error("The savepoint name can only contain alphanumeric characters");
    }
    name = name.toLowerCase();
    let savepoint = this.#savepoints.find((sv) => sv.name === name);
    if (savepoint) {
      try {
        await savepoint.update();
      } catch (e) {
        if (e instanceof PostgresError) {
          await this.commit();
          throw new TransactionError(this.name, e);
        } else {
          throw e;
        }
      }
    } else {
      savepoint = new Savepoint(name, async (name2) => {
        await this.queryArray(`SAVEPOINT ${name2}`);
      }, async (name2) => {
        await this.queryArray(`RELEASE SAVEPOINT ${name2}`);
      });
      try {
        await savepoint.update();
      } catch (e1) {
        if (e1 instanceof PostgresError) {
          await this.commit();
          throw new TransactionError(this.name, e1);
        } else {
          throw e1;
        }
      }
      this.#savepoints.push(savepoint);
    }
    return savepoint;
  }
  name;
};
var QueryClient = class {
  #connection;
  #terminated = false;
  #transaction = null;
  constructor(connection) {
    this.#connection = connection;
  }
  get connected() {
    return this.#connection.connected;
  }
  get session() {
    return {
      current_transaction: this.#transaction,
      pid: this.#connection.pid,
      tls: this.#connection.tls,
      transport: this.#connection.transport
    };
  }
  #assertOpenConnection() {
    if (this.#terminated) {
      throw new Error("Connection to the database has been terminated");
    }
  }
  async closeConnection() {
    if (this.connected) {
      await this.#connection.end();
    }
    this.resetSessionMetadata();
  }
  createTransaction(name, options) {
    this.#assertOpenConnection();
    return new Transaction(name, options, this, this.#executeQuery.bind(this), (name2) => {
      this.#transaction = name2;
    });
  }
  async connect() {
    if (!this.connected) {
      await this.#connection.startup(false);
      this.#terminated = false;
    }
  }
  async end() {
    await this.closeConnection();
    this.#terminated = true;
  }
  async #executeQuery(query4) {
    return await this.#connection.query(query4);
  }
  async queryArray(query_template_or_config, ...args) {
    this.#assertOpenConnection();
    if (this.#transaction !== null) {
      throw new Error(`This connection is currently locked by the "${this.#transaction}" transaction`);
    }
    let query;
    if (typeof query_template_or_config === "string") {
      query = new Query(query_template_or_config, ResultType.ARRAY, args[0]);
    } else if (isTemplateString(query_template_or_config)) {
      query = templateStringToQuery(query_template_or_config, args, ResultType.ARRAY);
    } else {
      query = new Query(query_template_or_config, ResultType.ARRAY);
    }
    return await this.#executeQuery(query);
  }
  async queryObject(query_template_or_config, ...args) {
    this.#assertOpenConnection();
    if (this.#transaction !== null) {
      throw new Error(`This connection is currently locked by the "${this.#transaction}" transaction`);
    }
    let query;
    if (typeof query_template_or_config === "string") {
      query = new Query(query_template_or_config, ResultType.OBJECT, args[0]);
    } else if (isTemplateString(query_template_or_config)) {
      query = templateStringToQuery(query_template_or_config, args, ResultType.OBJECT);
    } else {
      query = new Query(query_template_or_config, ResultType.OBJECT);
    }
    return await this.#executeQuery(query);
  }
  resetSessionMetadata() {
    this.#transaction = null;
  }
};
var Client1 = class extends QueryClient {
  constructor(config) {
    super(new Connection(createParams(config), async () => {
      await this.closeConnection();
    }));
  }
};
var PoolClient = class extends QueryClient {
  #release;
  constructor(config, releaseCallback) {
    super(new Connection(config, async () => {
      await this.closeConnection();
    }));
    this.#release = releaseCallback;
  }
  release() {
    this.#release();
    this.resetSessionMetadata();
  }
};
var Pool = class {
  #available_connections;
  #connection_params;
  #ended = false;
  #lazy;
  #ready;
  #size;
  get available() {
    if (!this.#available_connections) {
      return 0;
    }
    return this.#available_connections.available;
  }
  get size() {
    if (!this.#available_connections) {
      return 0;
    }
    return this.#available_connections.size;
  }
  constructor(connection_params, size, lazy = false) {
    this.#connection_params = createParams(connection_params);
    this.#lazy = lazy;
    this.#size = size;
    this.#ready = this.#initialize();
  }
  async connect() {
    if (this.#ended) {
      this.#ready = this.#initialize();
    }
    await this.#ready;
    return this.#available_connections.pop();
  }
  async end() {
    if (this.#ended) {
      throw new Error("Pool connections have already been terminated");
    }
    await this.#ready;
    while (this.available > 0) {
      const client = await this.#available_connections.pop();
      await client.end();
    }
    this.#available_connections = void 0;
    this.#ended = true;
  }
  async #initialize() {
    const initialized = this.#lazy ? 0 : this.#size;
    const clients = Array.from({
      length: this.#size
    }, async (_e, index) => {
      const client = new PoolClient(this.#connection_params, () => this.#available_connections.push(client));
      if (index < initialized) {
        await client.connect();
      }
      return client;
    });
    this.#available_connections = new DeferredAccessStack(await Promise.all(clients), (client) => client.connect(), (client) => client.connected);
    this.#ended = false;
  }
  async initialized() {
    if (!this.#available_connections) {
      return 0;
    }
    return await this.#available_connections.initialized();
  }
};
export {
  Client1 as Client,
  ConnectionError,
  Pool,
  PoolClient,
  PostgresError,
  QueryClient,
  Savepoint,
  Transaction,
  TransactionError
};
