use anchor_lang::prelude::*;

#[error_code]
pub enum LaunchpadError {
    #[msg("Presale has not started yet")]
    PresaleNotStarted,

    #[msg("Presale has already ended")]
    PresaleEnded,

    #[msg("Presale is paused")]
    PresalePaused,

    #[msg("Contribution amount is below minimum")]
    BelowMinContribution,

    #[msg("Contribution amount exceeds maximum")]
    ExceedsMaxContribution,

    #[msg("Hard cap reached")]
    HardCapReached,

    #[msg("Soft cap not met, presale failed")]
    SoftCapNotMet,

    #[msg("Presale is not finalized yet")]
    NotFinalized,

    #[msg("Presale already finalized")]
    AlreadyFinalized,

    #[msg("Not whitelisted for private sale")]
    NotWhitelisted,

    #[msg("No tokens to claim")]
    NoTokensToClaim,

    #[msg("Vesting period not reached")]
    VestingLocked,

    #[msg("Invalid presale configuration")]
    InvalidConfig,

    #[msg("Unauthorized access")]
    Unauthorized,

    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,

    #[msg("Invalid timestamp")]
    InvalidTimestamp,

    #[msg("Cannot update finalized presale")]
    CannotUpdateFinalized,

    #[msg("Insufficient tokens in vault")]
    InsufficientTokens,
}
