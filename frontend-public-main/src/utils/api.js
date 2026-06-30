const apiBase = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "")

function apiUrl(path) {
    if (!path) {
        return apiBase
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`
    return `${apiBase}${normalizedPath}`
}

export async function request(path, options = {}) {
    const { body, headers, ...rest } = options
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData

    const response = await fetch(apiUrl(path), {
        credentials: "include",
        headers: {
            Accept: "application/json",
            ...(body === undefined ? {} : isFormData ? {} : { "Content-Type": "application/json" }),
            ...headers,
        },
        ...(body === undefined ? {} : { body: isFormData ? body : JSON.stringify(body) }),
        ...rest,
    })

    if (response.status === 204) {
        return null
    }

    const contentType = response.headers.get("content-type") ?? ""
    const payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text()

    if (!response.ok) {
        const message =
            (payload && typeof payload === "object" && "message" in payload && payload.message) ||
            (typeof payload === "string" && payload.trim()) ||
            response.statusText ||
            "Request failed"

        throw new Error(message)
    }

    return payload
}
