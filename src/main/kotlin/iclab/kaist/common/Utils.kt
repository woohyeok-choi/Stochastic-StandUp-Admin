package iclab.kaist.common

import com.google.api.core.ApiFuture
import kotlinx.coroutines.withContext
import kotlin.coroutines.*

suspend fun <T : Any> ApiFuture<T?>.asSuspend(
    context: CoroutineContext = EmptyCoroutineContext,
    throwable: Throwable? = null
)= withContext(context) {
     suspendCoroutine<T?> { continuation ->
         try {
             continuation.resume(get())
         } catch (e: Exception) {
             continuation.resumeWithException(throwable ?: e)
         }
    }
}