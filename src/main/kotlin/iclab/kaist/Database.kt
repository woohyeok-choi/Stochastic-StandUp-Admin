package iclab.kaist

import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.firestore.Firestore
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.cloud.FirestoreClient
import iclab.kaist.common.asSuspend
import iclab.kaist.data.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import java.io.File
import java.lang.Exception

class Database(
    databaseUrl: String,
    private val rootPath: String
) {
    private val context = Dispatchers.IO + SupervisorJob()

    private val options =
        FirebaseOptions.Builder()
            .setCredentials(
                GoogleCredentials.fromStream(javaClass.classLoader.getResourceAsStream("secret.json"))
            )
            .setDatabaseUrl(databaseUrl)
            .build()


    private val fireStore: Firestore

    init {
        FirebaseApp.initializeApp(options)
        fireStore = FirestoreClient.getFirestore()
    }

    suspend fun listUsers(limit: Int = Int.MAX_VALUE) : Map<String, OverallStat> =
        fireStore.collection(rootPath).limit(limit).get().asSuspend(context)?.documents?.associate { doc ->
            doc.id to OverallStat.fromDocumentSnapshot(doc)
        } ?: mapOf()

    suspend fun getOverallStat(email: String) =
        OverallStat.get(fireStore.collection(rootPath), email, context)

    suspend fun listEvents(email: String, fromTime: Long = 0, toTime: Long = Long.MAX_VALUE, limit: Int = Int.MAX_VALUE) : List<SedentaryDurationEvent> {
        return Event.select(
            ref = fireStore.collection(rootPath).document(email).collection("events"),
            orderBy = Events.timestamp,
            isAscending = false,
            limit = limit,
            context = context
        ) {
            Events.timestamp greaterThanOrEqualTo fromTime
            Events.timestamp lessThan toTime
        }.toDurationEvents(fromTime, toTime, System.currentTimeMillis())
    }

    suspend fun listTriggeredMissions(email: String, fromTime: Long = 0, toTime: Long = Long.MAX_VALUE, limit: Int = Int.MAX_VALUE) =
        Mission.select(
            ref = fireStore.collection(rootPath).document(email).collection("missions"),
            orderBy = Missions.triggerTime,
            isAscending = false,
            limit = limit,
            context = context
        ) {
            Missions.triggerTime greaterThanOrEqualTo fromTime
            Missions.triggerTime lessThan toTime
        }

    suspend fun listPlaceStats(email: String, limit: Int = Int.MAX_VALUE) = PlaceStat.select(
        ref = fireStore.collection(rootPath).document(email).collection("places"),
        orderBy = PlaceStats.lastVisitTime,
        isAscending = false,
        limit = limit,
        context = context
    )

}