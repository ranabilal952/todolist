<template>
  <section class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Todo List</h3>

              <div class="card-tools">
                <button
                  type="button"
                  class="btn btn-sm btn-primary"
                  @click="newModal"
                >
                  <i class="fa fa-plus-square"></i>
                  Add New
                </button>
              </div>
              <!-- <p>{{ this.newuser }}</p> -->
            </div>
            <!-- /.card-header -->
            <div class="card-body table-responsive p-0">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Todo</th>
                    <th>Assigned To</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="todo in todo.data" :key="todo.id">
                    <td>{{ todo.id }}</td>
                    <td>{{ todo.todo }}</td>
                    <!-- <td>{{todo.description | truncate(30, '...')}}</td> -->
                    <td >{{ getNameThroughId(todo.assigned_to) }}</td>
                    <td>
                      <a href="#" @click="editModal(todo)">
                        <i class="fa fa-edit blue"></i>
                      </a>
                      /
                      <a href="#" @click="deletetodo(todo.id)">
                        <i class="fa fa-trash red"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- /.card-body -->
            <div class="card-footer">
              <pagination
                :data="todo"
                @pagination-change-page="getResults"
              ></pagination>
            </div>
          </div>
          <!-- /.card -->
        </div>
      </div>

      <!-- Modal -->
      <div
        class="modal fade"
        id="addNew"
        tabindex="-1"
        role="dialog"
        aria-labelledby="addNew"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" v-show="!editmode">Create New todo</h5>
              <h5 class="modal-title" v-show="editmode">Edit todo</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <form @submit.prevent="editmode ? updatetodo() : createtodo()">
              <div class="modal-body">
                <div class="form-group">
                  <label>Todo</label>
                  <input
                    v-model="form.todo"
                    type="text"
                    name="name"
                    class="form-control"
                    :class="{ 'is-invalid': form.errors.has('name') }"
                  />
                  <has-error :form="form" field="name"></has-error>
                </div>

                <div class="form-group">
                  <label>Assigned To</label>
                  <select
                    @change="onChange($event)"
                    name="assigned_to"
                    v-model="this.form.assigned_to"
                    class="form-control"
                  >
                    <option
                      v-for="item in newuser"
                      :value="item.id"
                      :key="item.id"
                    >
                      {{ item.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button v-show="editmode" type="submit" class="btn btn-success">
                  Update
                </button>
                <button
                  v-show="!editmode"
                  type="submit"
                  class="btn btn-primary"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import VueTagsInput from "@johmun/vue-tags-input";

export default {
  components: {
    VueTagsInput,
  },
  data() {
    return {
      editmode: false,
      todo: {},
      ass: {},
      name: "",
      newuser: {},
      form: new Form({
        id: "",
        todo: "",
        assigned_to: 0,
        madeby: this.$gate.giveUserID(),
      }),
    };
  },
  methods: {
    onChange(event) {
      this.form.assigned_to = event.target.value;
    },

    // getNameThroughId($id)
    // {
    //   axios.post("api/getName/"+$id).then(({ data }) => {
    //       return data;
    //   });

    // },

    getResults(page = 1) {
      this.$Progress.start();

      axios
        .get("api/todo?page=" + page)
        .then(({ data }) => (this.todo = data.data));

      this.$Progress.finish();
    },
    loadtodo() {
      // if(this.$gate.isAdmin()){
      axios.get("api/todo").then(({ data }) => (this.todo = data.data));

      // }
    },

    loadUserPerson() {
      axios
        .post(`/api/userperson/${this.$gate.giveUserID()}`)
        .then(({ data }) => (this.newuser = data.data));
    },

    editModal(todo) {
      this.editmode = true;
      this.form.reset();
      $("#addNew").modal("show");
      this.form.fill(todo);
    },
    newModal() {
      this.editmode = false;
      this.form.reset();
      $("#addNew").modal("show");
    },
    createtodo() {
      this.$Progress.start();

      this.form
        .post("api/todo")
        .then((data) => {
          if (data.data.success) {
            $("#addNew").modal("hide");

            Toast.fire({
              icon: "success",
              title: data.data.message,
            });
            this.$Progress.finish();
            this.loadtodo();
          } else {
            Toast.fire({
              icon: "error",
              title: "Some error occured! Please try again",
            });

            this.$Progress.failed();
          }
        })
        .catch(() => {
          Toast.fire({
            icon: "error",
            title: "Some error occured! Please try again",
          });
        });
    },
    updatetodo() {
      this.$Progress.start();
      this.form
        .put("api/todo/" + this.form.id)
        .then((response) => {
          // success
          $("#addNew").modal("hide");
          Toast.fire({
            icon: "success",
            title: response.data.message,
          });
          this.$Progress.finish();
          //  Fire.$emit('AfterCreate');

          this.loadtodo();
        })
        .catch(() => {
          this.$Progress.fail();
        });
    },
    deletetodo(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        // Send request to the server
        if (result.value) {
          this.form
            .delete("api/todo/" + id)
            .then(() => {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
              // Fire.$emit('AfterCreate');
              this.loadtodo();
            })
            .catch((data) => {
              Swal.fire("Failed!", data.message, "warning");
            });
        }
      });
    },
  },
  mounted() {},
  created() {
    this.$Progress.start();
    this.loadUserPerson();

    this.loadtodo();

    this.$Progress.finish();
  },
  filters: {
    truncate: function (text, length, suffix) {
      return text.substring(0, length) + suffix;
    },
  },
  computed: {
     getNameThroughId:  function () {
       
     return  ($id) =>
         axios.post("api/getName/" + $id).then(({ data }) => {
    return(data);
        });
    },

    filteredItems() {
      return this.autocompleteItems.filter((i) => {
        return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
      });
    },
  },
};
</script>
