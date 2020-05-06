package iclab.kaist

import com.fasterxml.jackson.databind.SerializationFeature
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.auth.*
import io.ktor.features.CORS
import io.ktor.features.CallLogging
import io.ktor.features.ContentNegotiation
import io.ktor.features.DefaultHeaders
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.*
import io.ktor.jackson.jackson
import io.ktor.request.uri
import io.ktor.response.respond
import io.ktor.routing.get
import io.ktor.routing.routing
import org.slf4j.event.Level
import java.io.File


const val FIREBASE_URL = "https://standup-stochastic-incentive.firebaseio.com"

fun Application.module() {
    val database = Database(FIREBASE_URL, "users")

    install(DefaultHeaders)
    install(CallLogging) {
        level = Level.INFO
    }
    install(ContentNegotiation) {
        jackson {
            enable(SerializationFeature.INDENT_OUTPUT)
        }
    }
    install(CORS) {
        method(HttpMethod.Options)
        method(HttpMethod.Get)
        method(HttpMethod.Post)
        method(HttpMethod.Put)
        method(HttpMethod.Delete)
        method(HttpMethod.Patch)
        header(HttpHeaders.Authorization)
        allowCredentials = true
        anyHost()
    }

    routing {
        get("/users") {
            val users = database.listUsers()
            call.respond(users)
        }

        get("/users/{user}") {
            val email = call.parameters["user"]
            if (email.isNullOrBlank()) {
                call.respond(HttpStatusCode.BadRequest)
                return@get
            }
            val result = database.getOverallStat(email)
            if (result == null) {
                call.respond(HttpStatusCode.NotFound)
            } else {
                call.respond(result)
            }
        }

        get("/users/{user}/events") {
            println(call.request.uri)
            val email = call.parameters["user"]
            if (email.isNullOrBlank()) {
                call.respond(HttpStatusCode.BadRequest)
                return@get
            }
            val query = call.request.queryParameters
            val fromTimes = query["fromTime"]?.split(",")?.mapNotNull { it.toLongOrNull() } ?: listOf()
            val toTimes = query["toTime"]?.split(",")?.mapNotNull { it.toLongOrNull() } ?: listOf()

            if (fromTimes.size != toTimes.size) {
                call.respond(HttpStatusCode.BadRequest)
                return@get
            }

            val result = fromTimes.zip(toTimes).map { (fromTime, toTime) ->
                database.listEvents(email, fromTime, toTime)
            }.flatten()

            call.respond(result)
        }

        get("/users/{user}/missions") {
            println(call.request.uri)

            val email = call.parameters["user"]
            if (email.isNullOrBlank()) {
                call.respond(HttpStatusCode.BadRequest)
                return@get
            }
            val query = call.request.queryParameters
            val fromTime = query["fromTime"]?.toLong() ?: 0
            val toTime = query["toTime"]?.toLong() ?: System.currentTimeMillis()
            val limit = query["limit"]?.toInt() ?: Int.MAX_VALUE

            val result = database.listTriggeredMissions(email, fromTime, toTime, limit)
            call.respond(result)
        }

        get("/users/{user}/places") {
            val email = call.parameters["user"]
            if (email.isNullOrBlank()) {
                call.respond(HttpStatusCode.BadRequest)
                return@get
            }
            val query = call.request.queryParameters
            val limit = query["limit"]?.toInt() ?: Int.MAX_VALUE

            val result = database.listPlaceStats(email, limit)
            call.respond(result)
        }

        get("/") {
            call.respond(call.resolveResource("templates/index.html")!!)
        }

        static {
            resources("templates")
        }
    }
}

