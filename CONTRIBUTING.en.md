# Contributing Guide

Thank you for your interest in contributing to EwVueComponent! We welcome all types of contributions, including but not limited to:

- 🐛 Bug reports
- 💡 Feature requests
- 📝 Documentation improvements
- 🔧 Code fixes
- ✨ New features
- 🧪 Test cases

## 📋 Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

## 🛠️ Development Setup

### Prerequisites

- Node.js >= 16.0.0
- pnpm >= 8.0.0
- Git

### Clone the Repository

```bash
git clone https://github.com/eveningwater/ew-vue-component.git
cd ew-vue-component
```

### Install Dependencies

```bash
pnpm install
```

### Development Commands

```bash
# Development mode (watch for changes)
pnpm dev

# Build the library
pnpm build

# Run tests
pnpm test

# Run tests (single run)
pnpm test:run

# Generate test coverage report
pnpm test:coverage

# Start documentation development server
pnpm docs:dev

# Build documentation
pnpm docs:build

# Start playground development server
pnpm playground:dev

# Build playground
pnpm playground:build

# Deploy everything to GitHub Pages
pnpm deploy:all
```

## 📁 Project Structure

```
ew-vue-component/
├── src/                    # Source code
│   ├── component.ts        # Main component implementation
│   ├── plugin.ts          # Vue plugin
│   ├── utils.ts           # Utility functions
│   ├── types.ts           # TypeScript type definitions
│   └── index.ts           # Main entry file
├── tests/                 # Test files
│   ├── component.test.ts  # Component tests
│   ├── plugin.test.ts     # Plugin tests
│   ├── utils.test.ts      # Utility function tests
│   ├── integration.test.ts # Integration tests
│   └── setup.ts           # Test setup
├── docs/                  # Documentation site
│   ├── .vitepress/        # VitePress configuration
│   ├── zh-CN/             # Chinese documentation
│   └── en/                # English documentation
├── playground/            # Online playground
│   └── src/               # Playground source code
├── dist/                  # Build output
└── deploy-all.sh          # Deployment script
```

## 🔄 Development Workflow

### 1. Create a Branch

```bash
# Create a new feature branch from main
git checkout -b feature/your-feature-name

# Or create a bug fix branch
git checkout -b fix/your-bug-fix
```

### 2. Development

- Write code in the `src/` directory
- Write corresponding tests in the `tests/` directory
- Update relevant documentation

### 3. Testing

Ensure all tests pass:

```bash
pnpm test:run
```

### 4. Building

Ensure the build succeeds:

```bash
pnpm build
```

## 📏 Code Standards

### TypeScript Standards

- Write all code in TypeScript
- Provide complete type definitions for public APIs
- Prefer interfaces over type aliases for object structures
- Use strict TypeScript configuration

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes
- Maximum line length of 100 characters
- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces

### Examples

```typescript
// ✅ Good example
interface ComponentOptions {
  name: string;
  props?: Record<string, any>;
  retryCount?: number;
}

export function createComponent(options: ComponentOptions): Component {
  const { name, props = {}, retryCount = 3 } = options;
  
  return {
    name,
    props,
    setup() {
      // Component logic
    }
  };
}

// ❌ Bad example
type componentOptions = {
  name:string
  props?:any
  retryCount?:number
}

export function createComponent(options:componentOptions):any{
  const {name,props={},retryCount=3}=options
  return{
    name,props,
    setup(){
      // Component logic
    }
  }
}
```

## 🧪 Testing Guidelines

### Testing Principles

- Every feature should have corresponding tests
- Tests should cover normal cases and edge cases
- Tests should be independent and not rely on other tests
- Use descriptive test names

### Test Structure

```typescript
describe('Feature Module Name', () => {
  beforeEach(() => {
    // Setup before tests
  });

  afterEach(() => {
    // Cleanup after tests
  });

  describe('Specific Feature', () => {
    it('should perform expected behavior', () => {
      // Test code
    });

    it('should handle error cases', () => {
      // Error handling test
    });
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test component.test.ts

# Generate coverage report
pnpm test:coverage
```

## 📝 Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation updates
- `style`: Code style changes (no functional changes)
- `refactor`: Code refactoring
- `test`: Test-related changes
- `chore`: Build process or auxiliary tool changes
- `perf`: Performance improvements
- `ci`: CI/CD related changes

### Commit Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Examples

```bash
# New feature
git commit -m "feat(component): add retry mechanism for failed components"

# Bug fix
git commit -m "fix(utils): handle null values in error handler"

# Documentation update
git commit -m "docs: update installation guide"

# Refactoring
git commit -m "refactor(plugin): simplify error handling logic"
```

## 🔀 Pull Request Process

### 1. Pre-submission Checklist

- [ ] All tests pass
- [ ] Code builds successfully
- [ ] Code follows standards
- [ ] Relevant documentation updated
- [ ] Commit messages follow convention

### 2. Create Pull Request

1. Push branch to GitHub
2. Create Pull Request
3. Fill out PR template
4. Wait for code review

### 3. PR Template

```markdown
## 📋 Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement
- [ ] Other

## 📝 Description
Brief description of the changes and the reason for them.

## 🧪 Testing
- [ ] Added new test cases
- [ ] All existing tests pass
- [ ] Manual testing completed

## 📚 Documentation
- [ ] Updated relevant documentation
- [ ] Added API documentation
- [ ] Updated example code

## 💥 Breaking Changes
If there are breaking changes, please describe them in detail.

## 📸 Screenshots/Demo
If applicable, provide screenshots or demo links.
```

### 4. Code Review

- Maintainers will review your code
- They may suggest modifications
- Please respond promptly and make necessary changes

## 🚀 Release Process

Releases are handled by maintainers with the following process:

1. Ensure all tests pass
2. Update version number
3. Update CHANGELOG
4. Create Git tag
5. Publish to npm
6. Deploy documentation and playground

## 🤝 Code of Conduct

### Our Pledge

To create an open and welcoming environment, we pledge to:

- Use welcoming and inclusive language
- Respect different viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what's best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Use of sexualized language or imagery and unwelcome sexual attention or advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct that could reasonably be considered inappropriate in a professional setting

## 📞 Contact

If you have any questions or need help, you can contact us through:

- 📧 Email: [854806732@qq.com](mailto:854806732@qq.com)
- 🐛 Issues: [GitHub Issues](https://github.com/eveningwater/ew-vue-component/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/eveningwater/ew-vue-component/discussions)

## 🎉 Acknowledgments

Thanks to all developers who have contributed to the EwVueComponent project!

## 📄 License

By contributing code, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you again for your contribution! 🙏 