# Contributing to RION

Thank you for your interest in contributing to RION Oracle Network!

## Development Setup

1. Clone the repository
   \`\`\`bash
   [git clone https://github.com/rion/RionOracle](https://github.com/RionOracle)
   cd rion-oracle
   \`\`\`

2. Install dependencies
   \`\`\`bash
   npm install
   forge install
   \`\`\`

3. Set up environment variables
   \`\`\`bash
   cp .env.example .env

# Edit .env with your configuration

\`\`\`

4. Run tests
   \`\`\`bash
   forge test
   npm test
   \`\`\`

## Contribution Guidelines

### Code Style

- Use TypeScript for SDK and frontend code
- Follow Solidity best practices for smart contracts
- Run linters before committing: \`npm run lint\`
- Format code with Prettier: \`npm run format\`

### Commit Messages

Use conventional commits:

- \`feat:\` New features
- \`fix:\` Bug fixes
- \`docs:\` Documentation changes
- \`test:\` Test additions or changes
- \`refactor:\` Code refactoring

### Pull Requests

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/my-feature\`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Testing

- Write unit tests for all new functions
- Add integration tests for contract interactions
- Test SDK methods with mock data
- Verify UI changes in multiple browsers

## Areas for Contribution

- Smart contract optimizations
- SDK feature additions
- Documentation improvements
- Example integrations
- Bug fixes
- UI/UX enhancements

## Questions?

Join our [Discord](https://discord.gg/rion) or open an issue on GitHub.
\`\`\`
