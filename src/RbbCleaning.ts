import { LitElement, html, css } from 'lit';
import { property, customElement, query } from 'lit/decorators.js';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';

// const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

@customElement('rbb-cleaning')
export class RbbCleaning extends LitElement {
  @property({ type: String }) title = 'RBB-Cleaning';

  @property({ type: Object }) fbAuth = null;

  @property({ type: Object }) fbDb = null;

  @query('#loginForm') loginFormEle: HTMLDivElement;

  @query('#userEmail') emailEle: HTMLInputElement;

  @query('#userPass') passwordEle: HTMLInputElement;

  @query('#emailDisplay') emailDisplayEle: HTMLHeadElement;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--rbb-cleaning-background-color);
    }

    main {
      flex-grow: 1;
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }

    #message {
      background: white;
      max-width: 360px;
      margin: 100px auto 16px;
      padding: 32px 24px;
      border-radius: 3px;
    }
    #message h2 {
      color: #ffa100;
      font-weight: bold;
      font-size: 16px;
      margin: 0 0 8px;
    }
    #message h1 {
      font-size: 22px;
      font-weight: 300;
      color: rgba(0, 0, 0, 0.6);
      margin: 0 0 16px;
    }
    #message p {
      line-height: 140%;
      margin: 16px 0 24px;
      font-size: 14px;
    }
    #message a {
      display: block;
      text-align: center;
      background: #039be5;
      text-transform: uppercase;
      text-decoration: none;
      color: white;
      padding: 16px;
      border-radius: 4px;
    }
    #message,
    #message a {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    }
  `;

  firstUpdated() {
    this.fbAuth = getAuth(globalThis.fbApp);
    this.fbDb = getDatabase(globalThis.fbApp);
    // const loginFormEle = document.getElementById('loginForm');
    // const emailEle = document.getElementById('userEmail');
    // const passwordEle = document.getElementById('userPass');
    // const emailDisplayEle = document.getElementById('emailDisplay');

    this.fbAuth.onAuthStateChanged(user => {
      console.log('onAuthStateChanged-user', user);

      if (user?.email) {
        this.emailDisplayEle.innerHTML = user.email;
      } else {
        this.loginFormEle.style.display = 'block';
      }
    });

    const rbbCleaningDataRef = ref(this.fbDb, '/data');
    onValue(rbbCleaningDataRef, snapshot => {
      console.log('database-value-snapshot', snapshot);
      console.log('---------------------------');
      console.log(snapshot.val());
    });
  }

  private doUserLogin() {
    signInWithEmailAndPassword(
      this.fbAuth,
      this.emailEle.value,
      this.passwordEle.value
    )
      .then(userCredential => {
        // Signed in
        const { user } = userCredential;
        console.log('user', user);
        this.emailEle.value = '';
        this.passwordEle.value = '';
        this.loginFormEle.style.display = 'none';

        const rbbCleaningDataRef = ref(this.fbDb, '/data');
        onValue(rbbCleaningDataRef, snapshot => {
          console.log('database-value-snapshot-222', snapshot);
          console.log('---------------------------2222');
          console.log(snapshot.val());
        });
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('errorCode', errorCode);
        console.log('errorMessage', errorMessage);
      });
  }

  private addTheItem() {
    console.log(`${this.title} - addTheItem`);
  }

  render() {
    return html`
      <main>
        <h1>${this.title}</h1>
        <section id="message">
          <h2 id="emailDisplay">anonymous</h2>
          <hr />
          <button type="button" @click="${this.addTheItem}">Add Item</button>
          <div id="loginForm" style="display: none">
            email: <input id="userEmail" type="text" /> <br />
            pass: <input id="userPass" type="password" /> <br />
            <button type="button" @click="${this.doUserLogin}">
              doUserLogin
            </button>
          </div>
        </section>

        <p>Edit <code>src/RbbCleaning.ts</code> and save to reload.</p>
        <a
          class="app-link"
          href="https://open-wc.org/guides/developing-components/code-examples"
          target="_blank"
          rel="noopener noreferrer"
        >
          Code examples
        </a>
      </main>

      <p class="app-footer">
        🚽 Made with love by
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/open-wc"
          >open-wc</a
        >.
      </p>
    `;
  }
}
