# Comparison to other AJAX libraries/solutions

Explanations on why this library was made despite there being many libraries already out there.


## Why not use fetch?

[Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) is sometimes cumbersome:

- Must set `Content-Type` header and encode body manually when sending JSON
- Must call `response.json()` always when retrieving JSON
- Forces proper CORS always
- Does not reject on 4xx or 5xx responses status codes, only on network errors


## Why not use axios?

[Axios](https://github.com/axios/axios) has a history of issues related to global defaults and side-effects (some [severe](https://github.com/axios/axios/issues/385)). Some have been [fixed](https://github.com/axios/axios/pull/1395) but [more](https://github.com/axios/axios/pull/2207) still arise.

It is cumbersome and error-prone to set request configuration with a (nested) object. Also, this design sometimes leads to cumbersome workarounds (e.g. [unsetting a header value](https://github.com/axios/axios/issues/382)).


## Why not use jQuery.ajax?

If you have it in your project, sure. Not that common anymore.

Worth noting that older versions of jQuery, still widely in use, implement a [broken Promise implementation](https://stackoverflow.com/questions/23951745/is-any-jquery-version-compliant-to-promise-a-specifications/23958233#23958233).
