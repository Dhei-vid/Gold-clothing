import { takeLatest, all, call, put } from 'redux-saga/effects'

import USER_ACTION_TYPES from './user.types'

import {
  userSignInSuccess,
  userSignInFailed,
  userSignUpFailed,
  userSignUpSuccess,
  userSignOutSuccess,
  userSignOutFailed
} from './user.action'

import {
  signOutUser,
  getCurrentUser,
  createUserDocumentFromAuth,
  signInWithGooglePopup,
  signInAuthUserWithEmailAndPassword,
  createAuthUserWithEmailAndPassword
} from '../../utils/firebase/firebase.utils'

// GET USER SNAPSHOT FROM FIREBASE
export function* getSnapShotFromUserAuth (userAuth, additionalDetails) {
  try {
    // to call a function, use the call generator, the rest are parameters
    const userSnapShot = yield call(
      createUserDocumentFromAuth,
      userAuth,
      additionalDetails
    )

    yield put(
      userSignInSuccess({ id: userSnapShot.id, ...userSnapShot.data() })
    )

    console.log('userSnapShot', userSnapShot)
    console.log(userSnapShot.data())
  } catch (error) {
    yield put(userSignInFailed(error))
  }
}

// CHECK USER AUTH WITH EMAIL AND PW
export function* SignUp ({ payload: { email, password, displayName } }) {
  try {
    const { user } = yield call(
      createAuthUserWithEmailAndPassword,
      email,
      password
    )

    console.log(user)
    yield put(userSignUpSuccess(user, { displayName }))
  } catch (error) {
    yield put(userSignUpFailed(error))
  }
}

// SIGN UP (STORING USER DATA INTO FIREBASE) AND SIGNINIG IN AFTER THAT FUNCTIONALITIES
export function* signInAfterSignUp ({ payload: { user, additionalDetails } }) {
  yield call(getSnapShotFromUserAuth, user, additionalDetails)
}

// SIGN IN WITH EMAIL AND PW
export function* withEmailAndPasswordSignIn ({ payload: { email, password } }) {
  try {
    const { user } = yield call(
      signInAuthUserWithEmailAndPassword,
      email,
      password
    )

    yield call(getSnapShotFromUserAuth, user)
  } catch (error) {
    yield put(userSignInFailed(error))
  }
}

// SIGN IN WITH GOOGLE
export function* onGoogleSignIn () {
  try {
    // this returns an authentication document, which we extract the user doc
    const { user } = yield call(signInWithGooglePopup)

    yield call(getSnapShotFromUserAuth, user)
  } catch (error) {
    yield put(userSignInFailed(error))
  }
}

// SIGN OUT
export function* onSignOut () {
  try {
    yield call(signOutUser)
    yield put(userSignOutSuccess())
  } catch (error) {
    yield put(userSignOutFailed())
  }
}

//CHECK IF USER EXISTS IN FIREBASE
export function* isUserAuthenticated () {
  try {
    const userAuth = yield call(getCurrentUser)

    if (!userAuth) return

    yield call(getSnapShotFromUserAuth, userAuth)
  } catch (error) {
    yield put(userSignInFailed(error))
  }
}

export function* oncheckUserSession () {
  yield takeLatest(
    USER_ACTION_TYPES.CHECK_USER_SESSION_START,
    isUserAuthenticated
  )
}

export function* onSignInWithEmailAndPassword () {
  yield takeLatest(
    USER_ACTION_TYPES.EMAIL_SIGN_IN_START,
    withEmailAndPasswordSignIn
  )
}

export function* onSignInWithGoogle () {
  yield takeLatest(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START, onGoogleSignIn)
}

export function* onSignUpSucces () {
  yield takeLatest(USER_ACTION_TYPES.SIGN_UP_START, signInAfterSignUp)
}

export function* onSignUp () {
  yield takeLatest(USER_ACTION_TYPES.SIGN_UP_START, SignUp)
}

export function* onSignOutStart () {
  yield takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, onSignOut)
}

export function* userSaga () {
  yield all([
    call(oncheckUserSession),
    call(onSignInWithGoogle),
    call(onSignInWithEmailAndPassword),
    call(onSignUp),
    call(onSignUpSucces),
    call(onSignOutStart)
  ])
}
