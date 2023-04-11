const app = new Vue({
  el: '#app',
  data: {
    newTask: '',
    tasks: [],
    showModal: false,
    suggestions: [],
    selectedIndex: -1,
  },
  created() {
    this.loadTasks();
  },
  methods: {
    loadTasks() {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        this.tasks = JSON.parse(storedTasks);
      }
    },
    saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
    addTask() {
      if (this.newTask.trim()) {
        this.tasks.push({ name: this.newTask.trim(), completed: false });
        this.newTask = '';
        this.saveTasks();
      }
    },
    removeTask(index) {
      this.tasks.splice(index, 1);
      this.saveTasks();
    },
    async getSuggestions(index) {
      this.selectedIndex = index;
      const taskToBreak = this.tasks[index].name;
      const apiKey = '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';

      const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt: `Break down the task "${taskToBreak}" into smaller steps so that a person with difficulty operationalizing tasks has an easier time understanding what they need to do. Make sure you break each step with a new line and don't send anything else but the broken down tasks. Don't wrap the tasks in quotes, don't number them, don't send any explanatio, just send the raw data:`,
          max_tokens: 100,
          n: 1,
          stop: null,
          temperature: 0.5,
        }),
      });

      const data = await response.json();
      this.suggestions = data.choices[0].text.split('\n').filter(s => s.trim());
      this.showModal = true;
    },
    addSuggestions() {
      const tasksToAdd = this.suggestions.map(s => ({ name: s.trim(), completed: false }));
      this.tasks.splice(this.selectedIndex + 1, 0, ...tasksToAdd);
      this.saveTasks();
      this.closeModal();
    },
    closeModal() {
      this.showModal = false;
      this.suggestions = [];
      this.selectedIndex = -1;
    },
  },
});
