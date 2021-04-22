<template>
  <div id="app">
    <v-app id="inspire">
      <v-parallax
        dark
        height="664"
        src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col class="text-center" cols="12">
            <v-card width="400" class="mx-auto my-auto">
              <v-card-title class="#4ebc2a white--text">
                <h1 class="display-1">Login</h1>
              </v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    type="email"
                    label="Email"
                    prepend-icon="mdi-account-circle"
                    required
                  ></v-text-field>

                  <v-text-field
                    :type="showpassword?'text' : 'password'"
                    label="password"
                    prepend-icon="mdi-lock"
                    append-icon="mdi-eye-off"
                    @click:append="showpassword = !showpassword"
                    required
                  ></v-text-field>
                  <v-checkbox
                    v-model="checkbox"
                    label="Do you want to save passowrd ?"
                  ></v-checkbox>

                  <v-card-actions>
                    <v-btn color="#4ebc2a">Login</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="#4ebc2a">Forgot Password</v-btn>


                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-parallax>
    </v-app>
  </div>
</template>


<script>
  export default {
    name: "HelloWorld",

    data: () => ({
      showpassword: false,
      items: [
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
        },
      ],
    }),
    beforeMount() {
      this.createPost();
    },
    methods: {
      async createPost() {
        const request = new Request(
          "https://school.kfundi.com/api/login",
          {
            method: "POST",
            mode: "cors",
            cache: "default",
            body: JSON.stringify(this.post)
          }
        );
        const res = await fetch(request);
        const data = await res.json();
        this.data = data;
      }
    }
  };
</script>

